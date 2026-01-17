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

export interface ScanOptions {
  directory: string;
  watch?: boolean;
  port?: number;
  ignorePatterns?: string[];
}

export interface ScanResult {
  agents: Agent[];
  projectPath: string;
  scannedAt: Date;
  totalFiles: number;
}
