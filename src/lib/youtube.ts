/**
 * Extract a YouTube video id from the various URL shapes we may store
 * (watch?v=, youtu.be/, /embed/, /shorts/) or a bare 11-char id.
 */
export function getYouTubeId(input?: string | null): string | null {
  if (!input) return null;
  const value = input.trim();

  // Already a bare id (YouTube ids are 11 chars of [A-Za-z0-9_-]).
  if (/^[A-Za-z0-9_-]{11}$/.test(value)) return value;

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      return url.pathname.slice(1).split('/')[0] || null;
    }

    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      const v = url.searchParams.get('v');
      if (v) return v;
      const parts = url.pathname.split('/').filter(Boolean);
      const idx = parts.findIndex((p) => p === 'embed' || p === 'shorts' || p === 'v');
      if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];
    }
  } catch {
    // Not a valid URL — fall through to regex fallback.
  }

  const match = value.match(/[?&]v=([A-Za-z0-9_-]{11})/) || value.match(/([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

/**
 * Thumbnail candidates for a stored video URL, best quality first.
 *
 * maxresdefault/hq720 are sharp and 16:9 but YouTube does not generate them for
 * every video, so callers should fall through the list on load error.
 * mqdefault always exists and is 16:9 (unlike hqdefault, which is letterboxed).
 */
export function getYouTubeThumbnails(input?: string | null): string[] {
  const id = getYouTubeId(input);
  if (!id) return [];
  return [
    `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
    `https://img.youtube.com/vi/${id}/hq720.jpg`,
    `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
  ];
}

/** Build a privacy-friendly embed URL that autoplays inline. */
export function getYouTubeEmbedUrl(input?: string | null): string | null {
  const id = getYouTubeId(input);
  if (!id) return null;
  const params = new URLSearchParams({
    autoplay: '1',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}
