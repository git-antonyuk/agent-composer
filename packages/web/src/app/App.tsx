import { useEffect, useState } from 'react';
import { LayoutList, Network } from 'lucide-react';
import { useAgentStore } from './store/agents';
import { PromptInput } from '@widgets/prompt-input/PromptInput';
import { AgentList } from '@widgets/agent-list/AgentList';
import { AgentCanvas } from '@widgets/agent-canvas/AgentCanvas';
import { PromptPreview } from '@widgets/prompt-preview/PromptPreview';
import { HelpModal } from '@widgets/help-modal/HelpModal';
import { Button } from '@shared/ui';
import { useKeyboardShortcuts } from '@shared/lib/useKeyboardShortcuts';

function App() {
  const { setAgents, agents, viewMode, setViewMode, selectAll, deselectAll } = useAgentStore();
  const [projectPath, setProjectPath] = useState<string>('');

  useEffect(() => {
    // Load agents from window object (injected by CLI)
    const loadedAgents = window.__AGENTS_DATA__ || [];
    const loadedPath = window.__PROJECT_PATH__ || 'Unknown';

    setAgents(loadedAgents);
    setProjectPath(loadedPath);
  }, [setAgents]);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      ctrl: true,
      callback: () => setViewMode(viewMode === 'list' ? 'canvas' : 'list'),
      description: 'Toggle view mode',
    },
    {
      key: 'a',
      ctrl: true,
      shift: true,
      callback: selectAll,
      description: 'Select all agents',
    },
    {
      key: 'e',
      ctrl: true,
      shift: true,
      callback: deselectAll,
      description: 'Deselect all',
    },
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Agent Composer</h1>
            <p className="text-sm text-muted-foreground">
              Project: {projectPath}
            </p>
          </div>

          {/* View Mode Toggle & Help */}
          <div className="flex gap-2">
            {agents.length > 0 && (
              <>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <LayoutList className="h-4 w-4 mr-2" />
                  List
                </Button>
                <Button
                  variant={viewMode === 'canvas' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('canvas')}
                >
                  <Network className="h-4 w-4 mr-2" />
                  Canvas
                </Button>
              </>
            )}
            <HelpModal />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
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
          <>
            {/* Prompt Input */}
            <PromptInput />

            {/* Agent Selection & Preview */}
            <div className="flex-1 overflow-hidden grid grid-cols-2">
              {/* Left Panel: Agent List or Canvas */}
              <div className="border-r border-border overflow-hidden">
                {viewMode === 'list' ? <AgentList /> : <AgentCanvas />}
              </div>

              {/* Right Panel: Prompt Preview */}
              <div className="overflow-hidden p-6">
                <PromptPreview />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
