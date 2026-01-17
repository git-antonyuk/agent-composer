import { resolve } from 'node:path';
import { discoverAgentFiles } from './discover';
import { parseAgentFiles } from './parser';
import type { Agent, ScanOptions, ScanResult } from '../types';

/**
 * Scan a directory for agent files
 */
export async function scanDirectory(
  options: ScanOptions
): Promise<ScanResult> {
  const { directory, ignorePatterns = [] } = options;

  // Resolve to absolute path
  const absolutePath = resolve(directory);

  console.log(`📂 Scanning directory: ${absolutePath}`);

  // Discover agent files
  const agentFiles = await discoverAgentFiles({
    baseDir: absolutePath,
    ignorePatterns,
    maxDepth: 10,
  });

  console.log(`📄 Found ${agentFiles.length} agent files`);

  // Parse agent files
  const agents = await parseAgentFiles(agentFiles, absolutePath);

  console.log(`✅ Parsed ${agents.length} agents successfully`);

  // Sort by category, then name
  agents.sort((a, b) => {
    if (a.category !== b.category) {
      return (a.category || '').localeCompare(b.category || '');
    }
    return a.name.localeCompare(b.name);
  });

  return {
    agents,
    projectPath: absolutePath,
    scannedAt: new Date(),
    totalFiles: agentFiles.length,
  };
}

/**
 * Format scan results for console output
 */
export function formatScanResults(result: ScanResult): string {
  const { agents, projectPath, totalFiles } = result;

  const lines: string[] = [];

  lines.push('');
  lines.push('═══════════════════════════════════════════════════════');
  lines.push('  AGENT COMPOSER - SCAN RESULTS');
  lines.push('═══════════════════════════════════════════════════════');
  lines.push('');
  lines.push(`📂 Project Path: ${projectPath}`);
  lines.push(`📄 Total Files: ${totalFiles}`);
  lines.push(`✅ Agents Parsed: ${agents.length}`);
  lines.push('');

  if (agents.length === 0) {
    lines.push('⚠️  No agent files found.');
    lines.push('');
    lines.push('Expected patterns:');
    lines.push('  - CLAUDE.md (root instructions)');
    lines.push('  - AGENTS.md (app-specific)');
    lines.push('  - agents/*.md');
    lines.push('  - skills/*.md');
    lines.push('  - .claude/*.md');
    lines.push('');
    return lines.join('\n');
  }

  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('');

  // Group by category
  const byCategory = agents.reduce((acc, agent) => {
    const cat = agent.category || 'uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(agent);
    return acc;
  }, {} as Record<string, Agent[]>);

  const categories = Object.keys(byCategory).sort();

  for (const category of categories) {
    const categoryAgents = byCategory[category];

    lines.push(`📁 ${category.toUpperCase()} (${categoryAgents.length})`);
    lines.push('');

    for (const agent of categoryAgents) {
      lines.push(`  ▸ ${agent.name}`);
      lines.push(`    ${agent.description}`);
      lines.push(`    📍 ${agent.filePath}`);

      const tags = agent.tags && agent.tags.length > 0
        ? `🏷️  ${agent.tags.join(', ')}`
        : '';

      const tokens = agent.estimatedTokens
        ? `📊 ~${agent.estimatedTokens.toLocaleString()} tokens`
        : '';

      const meta = [tags, tokens].filter(Boolean).join('  ');
      if (meta) {
        lines.push(`    ${meta}`);
      }

      lines.push('');
    }
  }

  lines.push('═══════════════════════════════════════════════════════');
  lines.push('');

  return lines.join('\n');
}

/**
 * Export agents to JSON file
 */
export async function exportToJson(
  result: ScanResult,
  outputPath: string
): Promise<void> {
  const { writeFile } = await import('node:fs/promises');

  const json = JSON.stringify(result, null, 2);
  await writeFile(outputPath, json, 'utf-8');

  console.log(`💾 Exported to: ${outputPath}`);
}
