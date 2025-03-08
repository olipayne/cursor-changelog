/**
 * Generates a UUID v4 string
 * Simple implementation for Cloudflare Workers
 */
export function generateUUID(): string {
  return crypto.randomUUID();
}

/**
 * Extract version number from Cursor download URL
 * @param downloadUrl The download URL from Cursor API
 * @returns The extracted version string (e.g., "0.46.11")
 */
export function extractVersionFromURL(downloadUrl: string): string | null {
  const versionRegex = /Cursor-(\d+\.\d+\.\d+)/;
  const match = downloadUrl.match(versionRegex);
  
  if (match && match[1]) {
    return match[1];
  }
  
  return null;
}

/**
 * Compare version strings to determine if one is newer
 * @param versionA First version
 * @param versionB Second version
 * @returns true if versionB is newer than versionA
 */
export function isNewerVersion(versionA: string, versionB: string): boolean {
  const partsA = versionA.split('.').map(Number);
  const partsB = versionB.split('.').map(Number);
  
  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const partA = partsA[i] || 0;
    const partB = partsB[i] || 0;
    
    if (partB > partA) return true;
    if (partA > partB) return false;
  }
  
  return false; // Versions are equal
} 