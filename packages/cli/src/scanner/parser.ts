import { readFile } from 'node:fs/promises';
import { basename, relative } from 'node:path';
import matter from 'gray-matter';
import type { Agent, AgentFrontmatter } from '../types';
import { getFileStats } from './discover';

/**
 * Generate a unique ID from file path
 */
function generateId(filePath: string, baseDir: string): string {
  const relativePath = relative(baseDir, filePath);
  // Create a simple slug from the path
  return relativePath
    .replace(/\\/g, '/')
    .replace(/\.md$/, '')
    .replace(/[^a-z0-9\/]/gi, '-')
    .toLowerCase();
}

/**
 * Extract name from filename
 */
function extractNameFromPath(filePath: string): string {
  const filename = basename(filePath, '.md');

  // Handle special cases
  if (filename.toLowerCase() === 'claude') {
    return 'CLAUDE.md (Root Instructions)';
  }

  if (filename.toLowerCase() === 'agents') {
    return 'AGENTS.md (App Instructions)';
  }

  // Convert kebab-case or snake_case to Title Case
  return filename
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Parse agent file and extract metadata
 */
export async function parseAgentFile(
  filePath: string,
  baseDir: string
): Promise<Agent> {
  // Read file content
  const content = await readFile(filePath, 'utf-8');

  // Get file stats
  const stats = await getFileStats(filePath);

  // Parse frontmatter
  let frontmatter: AgentFrontmatter = {};
  let bodyContent = content;

  try {
    const parsed = matter(content);
    frontmatter = parsed.data as AgentFrontmatter;
    bodyContent = parsed.content;
  } catch (error) {
    // If frontmatter parsing fails, use full content
    console.warn(`Warning: Could not parse frontmatter in ${filePath}`);
  }

  // Extract metadata
  const id = generateId(filePath, baseDir);
  const name = frontmatter.name || extractNameFromPath(filePath);
  const description = frontmatter.description || extractDescription(bodyContent);
  const category = frontmatter.category || inferCategory(filePath);
  const tags = frontmatter.tags || [];
  const priority = frontmatter.priority;
  const estimatedTokens = frontmatter.estimatedTokens || estimateTokens(content);

  return {
    id,
    name,
    description,
    filePath,
    content,
    fileSize: stats.size,
    lastModified: stats.modified,
    category,
    tags,
    priority,
    estimatedTokens,
  };
}

/**
 * Extract description from content (first paragraph or heading)
 */
function extractDescription(content: string): string {
  // Remove frontmatter section if present
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---\n/, '');

  // Try to find first paragraph after any headings
  const lines = withoutFrontmatter.split('\n');
  let description = '';

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and headings
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    // Found a paragraph
    description = trimmed;
    break;
  }

  // Truncate if too long
  if (description.length > 150) {
    description = description.substring(0, 147) + '...';
  }

  return description || 'No description available';
}

/**
 * Infer category from file path
 */
function inferCategory(filePath: string): string {
  const lowerPath = filePath.toLowerCase();

  if (lowerPath.includes('claude.md')) return 'core';
  if (lowerPath.includes('agents.md')) return 'core';
  if (lowerPath.includes('/test')) return 'testing';
  if (lowerPath.includes('/review')) return 'quality';
  if (lowerPath.includes('/security')) return 'security';
  if (lowerPath.includes('/doc')) return 'documentation';
  if (lowerPath.includes('/deploy')) return 'deployment';
  if (lowerPath.includes('/skill')) return 'skill';

  return 'general';
}

/**
 * Estimate token count (rough approximation)
 */
function estimateTokens(text: string): number {
  // Rough estimation: ~4 characters per token
  return Math.ceil(text.length / 4);
}

/**
 * Parse multiple agent files
 */
export async function parseAgentFiles(
  filePaths: string[],
  baseDir: string
): Promise<Agent[]> {
  const agents: Agent[] = [];

  for (const filePath of filePaths) {
    try {
      const agent = await parseAgentFile(filePath, baseDir);
      agents.push(agent);
    } catch (error) {
      console.warn(`Warning: Could not parse agent file ${filePath}:`, error);
    }
  }

  return agents;
}
