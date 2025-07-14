import { round, score } from './score.js';

/**
 * Path to directory containing `_list.json` and all levels
 */
const dir = '/data';

/**
 * Fetches the list of levels and their data.
 * Returns an array: [[levelObject, null] or [null, path]]
 */
export async function fetchList() {
    let listResult;
    try {
        listResult = await fetch(`${dir}/_list.json`);
        if (!listResult.ok) throw new Error('List fetch failed');
        const list = await listResult.json();

        return await Promise.all(
            list.map(async (path, rank) => {
                try {
                    const levelResult = await fetch(`${dir}/${path}.json`);
                    if (!levelResult.ok) throw new Error();
                    const level = await levelResult.json();
                    return [
                        {
                            ...level,
                            path,
                            records: Array.isArray(level.records) ?
                                level.records.sort((a, b) => b.percent - a.percent) : [],
                        },
                        null,
                    ];
                } catch {
                    console.error(`Failed to load level #${rank + 1} ${path}.`);
                    return [null, path];
                }
            })
        );
    } catch (err) {
        console.error(`Failed to load list.`, err);
        return null;
    }
}

/**
 * Fetches the editors list.
 */
export async function fetchEditors() {
    try {
        const editorsResults = await fetch(`${dir}/_editors.json`);
        if (!editorsResults.ok) throw new Error('Editors fetch failed');
        const editors = await editorsResults.json();
        return editors;
    } catch (err) {
        console.error('Failed to load editors.', err);
        return null;
    }
}

/**
 * Builds and returns the leaderboard.
 * Returns: [sortedUserArray, listOfLoadingErrorPaths]
 */
export async function fetchLeaderboard() {
    const list = await fetchList();
    if (!list) return [[], ['_list.json']];

    const scoreMap = {};
    const errs = [];

    list.forEach(([level, err], rank) => {
        if (err) {
            errs.push(err);
            return;
        }
        if (!level) return;

        // Verification
        const verifierKey = Object.keys(scoreMap).find(
            (u) => u.toLowerCase() === level.verifier.toLowerCase()
        ) || level.verifier;
        scoreMap[verifierKey] ??= { verified: [], completed: [], progressed: [] };
        scoreMap[verifierKey].verified.push({
            rank: rank + 1,
            level: level.name,
            score: score(rank + 1, 100, level.percentToQualify),
            link: level.verification,
        });

        // Records
        (level.records || []).forEach((record) => {
            const userKey = Object.keys(scoreMap).find(
                (u) => u.toLowerCase() === record.user.toLowerCase()
            ) || record.user;
            scoreMap[userKey] ??= { verified: [], completed: [], progressed: [] };
            if (record.percent === 100) {
                scoreMap[userKey].completed.push({
                    rank: rank + 1,
                    level: level.name,
                    score: score(rank + 1, 100, level.percentToQualify),
                    link: record.link,
                });
            } else {
                scoreMap[userKey].progressed.push({
                    rank: rank + 1,
                    level: level.name,
                    percent: record.percent,
                    score: score(rank + 1, record.percent, level.percentToQualify),
                    link: record.link,
                });
            }
        });
    });

    // Map to array, calculate totals, sort
    const res = Object.entries(scoreMap).map(([user, scores]) => {
        const { verified, completed, progressed } = scores;
        const total = [verified, completed, progressed].flat().reduce((prev, cur) => prev + (cur.score || 0), 0);
        return {
            user,
            total: round(total),
            ...scores,
        };
    });

    return [res.sort((a, b) => b.total - a.total), errs];
}
