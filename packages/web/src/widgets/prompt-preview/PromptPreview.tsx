import { useState, useMemo } from 'react';
import { Copy, Download, Check } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@shared/ui';
import { useAgentStore } from '@app/store/agents';
import {
  generatePrompt,
  estimateTotalTokens,
  copyToClipboard,
  downloadAsFile,
} from '@features/prompt-generation/lib/generatePrompt';

export function PromptPreview() {
  const { getSelectedAgents, userPrompt } = useAgentStore();
  const selectedAgents = getSelectedAgents();

  const [copied, setCopied] = useState(false);

  const prompt = useMemo(() => {
    return generatePrompt({ agents: selectedAgents, userPrompt });
  }, [selectedAgents, userPrompt]);

  const totalTokens = useMemo(() => {
    return estimateTotalTokens(selectedAgents);
  }, [selectedAgents]);

  const handleCopy = async () => {
    const success = await copyToClipboard(prompt);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `agent-prompt-${timestamp}.md`;
    downloadAsFile(prompt, filename);
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Generated Prompt</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedAgents.length} agent(s) selected • ~
                {totalTokens.toLocaleString()} tokens
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!userPrompt || selectedAgents.length === 0}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={!userPrompt || selectedAgents.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0">
          <pre className="text-sm p-6 overflow-auto h-full whitespace-pre-wrap font-mono">
            {prompt}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
