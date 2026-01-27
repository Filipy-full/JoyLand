/**
 * Version compatibility utility
 * Ensures client and server are using compatible versions
 */

interface VersionCheckResponse {
  status: 'healthy' | 'mismatch' | 'error';
  version: string;
  clientVersion: string;
  timestamp: string;
}

export async function checkVersionCompatibility(): Promise<VersionCheckResponse> {
  try {
    const clientVersion = process.env.NEXT_PUBLIC_APP_VERSION || 'unknown';
    
    const response = await fetch('/api/health', {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!response.ok) {
      return {
        status: 'error',
        version: 'unknown',
        clientVersion,
        timestamp: new Date().toISOString(),
      };
    }
    
    const data = await response.json();
    
    const versionMatch = data.version === clientVersion;
    
    if (!versionMatch) {
      console.warn(
        `⚠️ Version mismatch detected. Client: ${clientVersion}, Server: ${data.version}`
      );
    }
    
    return {
      status: versionMatch ? 'healthy' : 'mismatch',
      version: data.version,
      clientVersion,
      timestamp: data.timestamp,
    };
  } catch (error) {
    console.error('Version check failed:', error);
    return {
      status: 'error',
      version: 'unknown',
      clientVersion: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown',
      timestamp: new Date().toISOString(),
    };
  }
}
