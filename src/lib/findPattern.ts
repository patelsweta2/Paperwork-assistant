import type { PlaceholderPattern } from "../type/document";

export const findMatchingPattern = (
    text: string,
    index: number,
    patterns: PlaceholderPattern[]
): PlaceholderPattern | null => {

    for (const pattern of patterns) {

        if (
            text.startsWith(
                pattern.start,
                index
            )
        ) {

            return pattern;

        }

    }

    return null;

}