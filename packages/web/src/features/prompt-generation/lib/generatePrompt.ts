import type { Agent } from '@shared/types/agent';

export interface GeneratePromptOptions {
  agents: Agent[];
  format?: 'mega-prompt' | 'markdown';
}

/**
 * Generate a mega-prompt from selected agents
 */
export function generatePrompt(options: GeneratePromptOptions): string {
  const { agents } = options;

  if (agents.length === 0) {
    return '# No agents selected\n\nPlease select at least one agent to generate a prompt.';
  }

  // Sort agents: core first, then by category
  const sortedAgents = [...agents].sort((a, b) => {
    if (a.category === 'core' && b.category !== 'core') return -1;
    if (a.category !== 'core' && b.category === 'core') return 1;
    return (a.category || '').localeCompare(b.category || '');
  });

  const lines: string[] = [];

  // Header
  lines.push('# Agent Instructions');
  lines.push('');
  lines.push(`Generated with ${agents.length} agent(s)`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Agent sections
  for (const agent of sortedAgents) {
    lines.push(`## ${agent.name}`);
    lines.push('');

    // Metadata
    const metadata: string[] = [];
    if (agent.category) metadata.push(`Category: ${agent.category}`);
    if (agent.priority) metadata.push(`Priority: ${agent.priority}`);
    if (agent.tags && agent.tags.length > 0) {
      metadata.push(`Tags: ${agent.tags.join(', ')}`);
    }
    metadata.push(`Path: ${agent.filePath}`);

    if (metadata.length > 0) {
      lines.push('**Metadata:**');
      metadata.forEach((m) => lines.push(`- ${m}`));
      lines.push('');
    }

    // Content (remove frontmatter if present)
    const content = agent.content.replace(/^---[\s\S]*?---\n/, '');
    lines.push(content.trim());
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  // Footer
  lines.push('# Your Task');
  lines.push('');
  lines.push('[Describe your task here]');
  lines.push('');

  return lines.join('\n');
}

/**
 * Estimate total tokens for selected agents
 */
export function estimateTotalTokens(agents: Agent[]): number {
  return agents.reduce((total, agent) => {
    return total + (agent.estimatedTokens || 0);
  }, 0);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Download text as a file
 */
export function downloadAsFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
