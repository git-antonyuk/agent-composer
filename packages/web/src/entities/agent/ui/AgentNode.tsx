import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@shared/ui';
import type { Agent } from '@shared/types/agent';

export interface AgentNodeData {
  agent: Agent;
  isSelected: boolean;
}

export const AgentNode = memo(({ data }: { data: AgentNodeData }) => {
  const { agent, isSelected } = data;

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-card shadow-lg min-w-[200px] max-w-[280px] transition-all ${
        isSelected
          ? 'border-primary ring-2 ring-primary/20'
          : 'border-border hover:border-primary/50'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-primary"
      />

      <div className="space-y-2">
        <div className="font-semibold text-sm truncate">{agent.name}</div>

        <div className="text-xs text-muted-foreground line-clamp-2">
          {agent.description}
        </div>

        <div className="flex flex-wrap gap-1">
          {agent.category && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0">
              {agent.category}
            </Badge>
          )}
          {agent.estimatedTokens && (
            <Badge variant="outline" className="text-xs px-1.5 py-0">
              {agent.estimatedTokens}t
            </Badge>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-primary"
      />
    </div>
  );
});

AgentNode.displayName = 'AgentNode';
