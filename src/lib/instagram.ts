/**
 * Instagram URL utility functions
 * Handles validation, normalization, and post ID extraction from Instagram URLs
 */

/**
 * Extract Instagram post ID from various URL formats
 * Supports:
 * - https://www.instagram.com/p/DQZKnWXkqT-/
 * - https://instagr.am/p/DQZKnWXkqT-/
 * - https://www.instagram.com/p/DQZKnWXkqT-/?utm_source=...
 * - instagram.com/p/DQZKnWXkqT-/
 */
export function extractInstagramPostId(url: string): string | null {
  if (!url || typeof url !== "string") {
    return null;
  }

  try {
    // Remove query parameters and fragments
    const cleanUrl = url.split("?")[0].split("#")[0];

    // Match Instagram post URL patterns
    // Pattern: instagram.com/p/POST_ID/ or instagr.am/p/POST_ID/
    const patterns = [
      /(?:instagram\.com|instagr\.am)\/p\/([A-Za-z0-9_-]+)/i,
      /\/p\/([A-Za-z0-9_-]+)/i, // Fallback for partial URLs
    ];

    for (const pattern of patterns) {
      const match = cleanUrl.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  } catch (error) {
    console.error("Error extracting Instagram post ID:", error);
    return null;
  }
}

/**
 * Validate if a URL is a valid Instagram post URL
 */
export function isValidInstagramPostUrl(url: string): boolean {
  if (!url || typeof url !== "string") {
    return false;
  }

  try {
    // Check if URL contains Instagram domain and /p/ path
    const instagramPatterns = [
      /^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/p\/[A-Za-z0-9_-]+/i,
      /^(www\.)?(instagram\.com|instagr\.am)\/p\/[A-Za-z0-9_-]+/i, // Without protocol
    ];

    return instagramPatterns.some((pattern) => pattern.test(url));
  } catch (error) {
    return false;
  }
}

/**
 * Normalize Instagram URL to standard format
 * Converts various formats to: https://www.instagram.com/p/POST_ID/
 */
export function normalizeInstagramUrl(url: string): string {
  if (!url || typeof url !== "string") {
    return url;
  }

  const postId = extractInstagramPostId(url);
  if (!postId) {
    return url; // Return original if we can't extract ID
  }

  // Return normalized URL
  return `https://www.instagram.com/p/${postId}/`;
}
