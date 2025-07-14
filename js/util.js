// Extracts the YouTube video ID from a given URL
// https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
export function getYoutubeIdFromUrl(url) {
    return url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|u\/\w\/|watch\?v=))([^#\&\?]{11})/
    )?.[1] ?? '';
}

// Returns the embed URL for a given YouTube video URL or ID
export function embed(video) {
    const id = getYoutubeIdFromUrl(video) || video;
    return `https://www.youtube.com/embed/${id}`;
}

// Formats a number with local grouping and three decimal places
export function localize(num) {
    return Number(num).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

// Returns the thumbnail image URL for a given YouTube video ID
export function getThumbnailFromId(id) {
    return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
}

// Shuffles an array in place (Fisher-Yates algorithm)
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }

    return array;
}
