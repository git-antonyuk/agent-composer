import { Card, CardHeader, CardTitle, CardContent, Badge } from '@shared/ui';
import { formatFileSize, formatDate } from '@shared/lib/utils';
import type { Agent } from '@shared/types/agent';

interface AgentPreviewProps {
  agent: Agent;
}

export function AgentPreview({ agent }: AgentPreviewProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{agent.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {agent.filePath}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Description */}
          <div>
            <h4 className="font-semibold text-sm mb-1">Description</h4>
            <p className="text-sm text-muted-foreground">{agent.description}</p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Category:</span>{' '}
              <Badge variant="secondary" className="ml-1">
                {agent.category || 'none'}
              </Badge>
            </div>
            {agent.priority && (
              <div>
                <span className="text-muted-foreground">Priority:</span>{' '}
                <Badge
                  variant={
                    agent.priority === 'high'
                      ? 'destructive'
                      : agent.priority === 'medium'
                      ? 'default'
                      : 'outline'
                  }
                  className="ml-1"
                >
                  {agent.priority}
                </Badge>
              </div>
            )}
            <div>
              <span className="text-muted-foreground">File Size:</span>{' '}
              {formatFileSize(agent.fileSize)}
            </div>
            <div>
              <span className="text-muted-foreground">Tokens:</span>{' '}
              {agent.estimatedTokens
                ? `~${agent.estimatedTokens.toLocaleString()}`
                : 'N/A'}
            </div>
            <div>
              <span className="text-muted-foreground">Last Modified:</span>{' '}
              {formatDate(new Date(agent.lastModified))}
            </div>
          </div>

          {/* Tags */}
          {agent.tags && agent.tags.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Tags</h4>
              <div className="flex flex-wrap gap-1">
                {agent.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Content Preview */}
          <div>
            <h4 className="font-semibold text-sm mb-2">Content Preview</h4>
            <pre className="text-xs bg-muted p-4 rounded-md overflow-auto max-h-96 whitespace-pre-wrap">
              {agent.content}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
