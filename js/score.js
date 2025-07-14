/**
 * Numbers of decimal digits to round to
 */
const scale = 3;

/**
 * Calculate the score awarded when having a certain percentage on a list level
 * @param {Number} rank Position on the list
 * @param {Number} percent Percentage of completion
 * @param {Number} minPercent Minimum percentage required
 * @returns {Number}
 */
export function score(rank, percent, minPercent) {
    if (rank > 150) {
        return 0;
    }
    if (rank > 75 && percent < 100) {
        return 0;
    }

    // New formula
    let baseScore = (-24.9975 * Math.pow(rank - 1, 0.4) + 200) *
        ((percent - (minPercent - 1)) / (100 - (minPercent - 1)));

    baseScore = Math.max(0, baseScore);

    if (percent !== 100) {
        return round(baseScore - baseScore / 3);
    }

    return Math.max(round(baseScore), 0);
}

/**
 * Rounds a number to the given scale (decimal digits)
 * @param {Number} num
 * @returns {Number}
 */
export function round(num) {
    return Number(num.toFixed(scale));
}
