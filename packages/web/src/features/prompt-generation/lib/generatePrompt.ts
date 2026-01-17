import type { Agent } from '@shared/types/agent';

export interface GeneratePromptOptions {
  agents: Agent[];
  userPrompt: string;
  format?: 'mega-prompt' | 'markdown';
}

/**
 * Generate a prompt with agent file paths
 */
export function generatePrompt(options: GeneratePromptOptions): string {
  const { agents, userPrompt } = options;

  if (!userPrompt && agents.length === 0) {
    return '# No task or agents selected\n\nPlease:\n1. Enter your task in the prompt field\n2. Select agents to help with the task';
  }

  if (!userPrompt) {
    return '# No task specified\n\nPlease enter your task in the prompt field above.';
  }

  if (agents.length === 0) {
    return `# Task\n\n${userPrompt}\n\n---\n\n**Note:** No agents selected. Select agents from the library to assist with this task.`;
  }

  // Sort agents: core first, then by category
  const sortedAgents = [...agents].sort((a, b) => {
    if (a.category === 'core' && b.category !== 'core') return -1;
    if (a.category !== 'core' && b.category === 'core') return 1;
    return (a.category || '').localeCompare(b.category || '');
  });

  const lines: string[] = [];

  // User's task
  lines.push('# Task');
  lines.push('');
  lines.push(userPrompt);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Agent instructions
  lines.push('# Agent Instructions');
  lines.push('');
  lines.push(`Use the following ${agents.length} agent instruction file(s) to complete the task above:`);
  lines.push('');

  // Group by category
  const byCategory: Record<string, Agent[]> = {};
  for (const agent of sortedAgents) {
    const cat = agent.category || 'general';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(agent);
  }

  const categories = Object.keys(byCategory).sort((a, b) => {
    if (a === 'core') return -1;
    if (b === 'core') return 1;
    return a.localeCompare(b);
  });

  for (const category of categories) {
    lines.push(`## ${category.charAt(0).toUpperCase() + category.slice(1)}`);
    lines.push('');

    for (const agent of byCategory[category]) {
      lines.push(`- **${agent.name}**`);
      lines.push(`  - Path: \`${agent.filePath}\``);
      if (agent.description) {
        lines.push(`  - ${agent.description}`);
      }
      if (agent.tags && agent.tags.length > 0) {
        lines.push(`  - Tags: ${agent.tags.join(', ')}`);
      }
      lines.push('');
    }
  }

  lines.push('---');
  lines.push('');
  lines.push('**Instructions:** Read each agent file listed above and follow their instructions to complete the task.');
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
