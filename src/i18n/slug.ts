/**
 * Turns a source English string into a stable translation-key fragment.
 * Shared by the content dictionary and the lookup helpers so a key can never
 * be spelled two different ways.
 */
export function slug(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
