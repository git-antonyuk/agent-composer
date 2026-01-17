import { useAgentStore } from '@app/store/agents';

export function PromptInput() {
  const { userPrompt, setUserPrompt } = useAgentStore();

  return (
    <div className="border-b border-border p-4 bg-muted/30">
      <label htmlFor="user-prompt" className="block text-sm font-medium mb-2">
        Your Task
      </label>
      <textarea
        id="user-prompt"
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
        placeholder="Describe what you want to accomplish (e.g., 'Implement user authentication with JWT tokens', 'Review the code for security vulnerabilities', 'Add comprehensive tests for the API endpoints')..."
        className="w-full h-24 px-3 py-2 text-sm border border-input rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <p className="text-xs text-muted-foreground mt-2">
        Enter your task, then select agents below to help complete it
      </p>
    </div>
  );
}
