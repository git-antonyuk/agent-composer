export interface Agent {
  id: string;
  name: string;
  description: string;
  filePath: string;
  content: string;
  fileSize: number;
  lastModified: Date;
  category?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
  estimatedTokens?: number;
}

export interface AgentFrontmatter {
  name?: string;
  description?: string;
  category?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
  estimatedTokens?: number;
}

export interface WorkflowNode {
  agentId: string;
  agentName: string;
  position: { x: number; y: number };
  selected: boolean;
}

export interface Workflow {
  version: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  projectPath: string;
  agents: WorkflowNode[];
  connections: WorkflowConnection[];
  generationStrategy: 'mega-prompt' | 'skill-file';
  customNotes: string;
}

export interface WorkflowConnection {
  source: string;
  target: string;
  type: 'sequential' | 'parallel';
}

// Global type for data passed from CLI to web UI
declare global {
  interface Window {
    __AGENTS_DATA__?: Agent[];
    __PROJECT_PATH__?: string;
  }
}
