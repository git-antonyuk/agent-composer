import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '@shared/ui';
import { formatFileSize, formatDate } from '@shared/lib/utils';
import type { Agent } from '@shared/types/agent';

interface AgentCardProps {
  agent: Agent;
  isSelected: boolean;
  onToggleSelect: (agentId: string) => void;
  onClick?: () => void;
}

export function AgentCard({
  agent,
  isSelected,
  onToggleSelect,
  onClick,
}: AgentCardProps) {
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card
      className={`cursor-pointer transition-colors hover:bg-accent/50 ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect(agent.id)}
                onClick={handleCheckboxClick}
                className="h-4 w-4 rounded border-gray-300"
              />
              <CardTitle className="text-lg">{agent.name}</CardTitle>
            </div>
            <CardDescription>{agent.description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {/* Category and Priority */}
          <div className="flex flex-wrap gap-2">
            {agent.category && (
              <Badge variant="secondary">{agent.category}</Badge>
            )}
            {agent.priority && (
              <Badge
                variant={
                  agent.priority === 'high'
                    ? 'destructive'
                    : agent.priority === 'medium'
                    ? 'default'
                    : 'outline'
                }
              >
                {agent.priority}
              </Badge>
            )}
          </div>

          {/* Tags */}
          {agent.tags && agent.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {agent.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
            <span>{formatFileSize(agent.fileSize)}</span>
            {agent.estimatedTokens && (
              <span>~{agent.estimatedTokens.toLocaleString()} tokens</span>
            )}
            <span>{formatDate(new Date(agent.lastModified))}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
