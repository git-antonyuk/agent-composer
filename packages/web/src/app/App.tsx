import { useEffect, useState } from 'react';
import { useAgentStore } from './store/agents';
import { AgentList } from '@widgets/agent-list/AgentList';
import { PromptPreview } from '@widgets/prompt-preview/PromptPreview';

function App() {
  const { setAgents, agents } = useAgentStore();
  const [projectPath, setProjectPath] = useState<string>('');

  useEffect(() => {
    // Load agents from window object (injected by CLI)
    const loadedAgents = window.__AGENTS_DATA__ || [];
    const loadedPath = window.__PROJECT_PATH__ || 'Unknown';

    setAgents(loadedAgents);
    setProjectPath(loadedPath);
  }, [setAgents]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold">Agent Composer</h1>
          <p className="text-sm text-muted-foreground">
            Project: {projectPath}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {agents.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center p-8">
            <div>
              <p className="text-lg text-muted-foreground mb-2">
                No agents found
              </p>
              <p className="text-sm text-muted-foreground">
                Run the CLI scanner to discover agents in your project
              </p>
              <pre className="mt-4 text-xs bg-muted p-4 rounded-md text-left">
                bun run cli scan ./path/to/project
              </pre>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 h-full">
            {/* Left Panel: Agent List */}
            <div className="border-r border-border overflow-hidden">
              <AgentList />
            </div>

            {/* Right Panel: Prompt Preview */}
            <div className="overflow-hidden p-6">
              <PromptPreview />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
