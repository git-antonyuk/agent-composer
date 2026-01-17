import { readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

export interface DiscoverOptions {
  baseDir: string;
  ignorePatterns?: string[];
  maxDepth?: number;
}

const DEFAULT_IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  'coverage',
  '.turbo',
  '.vercel',
  '.netlify',
];

/**
 * Check if a path should be ignored based on patterns
 */
function shouldIgnore(path: string, ignorePatterns: string[]): boolean {
  const normalizedPath = path.toLowerCase();

  return ignorePatterns.some(pattern => {
    const normalizedPattern = pattern.toLowerCase();

    // Direct match
    if (normalizedPath.includes(normalizedPattern)) {
      return true;
    }

    // Path segment match
    const segments = normalizedPath.split('/');
    return segments.some(segment => segment === normalizedPattern);
  });
}

/**
 * Check if a file matches agent file patterns
 */
export function isAgentFile(filePath: string): boolean {
  const lowerPath = filePath.toLowerCase();

  // Root instruction files
  if (lowerPath.endsWith('claude.md') || lowerPath.endsWith('agents.md')) {
    return true;
  }

  // Agent directory patterns
  if (lowerPath.includes('/agents/') && lowerPath.endsWith('.md')) {
    return true;
  }

  if (lowerPath.includes('/skills/') && lowerPath.endsWith('.md')) {
    return true;
  }

  // .claude directory pattern
  if (lowerPath.includes('/.claude/') && lowerPath.endsWith('.md')) {
    return true;
  }

  return false;
}

/**
 * Recursively discover files in a directory
 */
async function walkDirectory(
  dir: string,
  baseDir: string,
  ignorePatterns: string[],
  depth: number,
  maxDepth: number,
  files: string[] = []
): Promise<string[]> {
  if (depth > maxDepth) {
    return files;
  }

  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      const relativePath = relative(baseDir, fullPath);

      // Skip ignored paths
      if (shouldIgnore(relativePath, ignorePatterns)) {
        continue;
      }

      if (entry.isDirectory()) {
        // Recurse into subdirectory
        await walkDirectory(
          fullPath,
          baseDir,
          ignorePatterns,
          depth + 1,
          maxDepth,
          files
        );
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Ignore permission errors and continue
    if ((error as NodeJS.ErrnoException).code !== 'EACCES') {
      console.warn(`Warning: Could not read directory ${dir}:`, error);
    }
  }

  return files;
}

/**
 * Discover all agent files in a directory
 */
export async function discoverAgentFiles(
  options: DiscoverOptions
): Promise<string[]> {
  const {
    baseDir,
    ignorePatterns = [],
    maxDepth = 10,
  } = options;

  // Combine default and custom ignore patterns
  const allIgnorePatterns = [
    ...DEFAULT_IGNORE_PATTERNS,
    ...ignorePatterns,
  ];

  // Get all files
  const allFiles = await walkDirectory(
    baseDir,
    baseDir,
    allIgnorePatterns,
    0,
    maxDepth
  );

  // Filter for agent files
  const agentFiles = allFiles.filter(file => isAgentFile(file));

  return agentFiles;
}

/**
 * Get file stats for a path
 */
export async function getFileStats(filePath: string) {
  try {
    const stats = await stat(filePath);
    return {
      size: stats.size,
      modified: stats.mtime,
    };
  } catch (error) {
    return {
      size: 0,
      modified: new Date(),
    };
  }
}
