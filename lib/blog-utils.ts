export function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    // Strip HTML tags
    const cleanText = content.replace(/<[^>]*>/g, "");
    const numberOfWords = cleanText.split(/\s+/).filter(word => word.length > 0).length;
    const minutes = Math.ceil(numberOfWords / wordsPerMinute);
    return minutes;
}
