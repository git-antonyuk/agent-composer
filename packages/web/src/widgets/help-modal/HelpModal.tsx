import { HelpCircle, X } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@shared/ui';
import { useState } from 'react';

export function HelpModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        title="Help & Keyboard Shortcuts"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setIsOpen(false)}
        >
          <Card
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="border-b border-border flex flex-row items-center justify-between">
              <CardTitle>Help & Keyboard Shortcuts</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Keyboard Shortcuts */}
              <div>
                <h3 className="font-semibold mb-3">Keyboard Shortcuts</h3>
                <div className="space-y-2 text-sm">
                  <ShortcutRow
                    keys={['Ctrl', 'K']}
                    description="Toggle List/Canvas view"
                  />
                  <ShortcutRow
                    keys={['Ctrl', 'Shift', 'A']}
                    description="Select all agents"
                  />
                  <ShortcutRow
                    keys={['Ctrl', 'Shift', 'E']}
                    description="Deselect all agents"
                  />
                  <ShortcutRow
                    keys={['Ctrl', 'C']}
                    description="Copy prompt (when focused)"
                  />
                  <ShortcutRow
                    keys={['Ctrl', 'D']}
                    description="Download prompt (when focused)"
                  />
                </div>
              </div>

              {/* How to Use */}
              <div>
                <h3 className="font-semibold mb-3">How to Use</h3>
                <ol className="space-y-2 text-sm list-decimal list-inside">
                  <li>Select agents from the list or canvas by clicking checkboxes or nodes</li>
                  <li>Search and filter agents using the search bar and category badges</li>
                  <li>Switch between List and Canvas views using the toggle buttons</li>
                  <li>View the generated prompt in the right panel</li>
                  <li>Copy or download the prompt for use with Claude</li>
                </ol>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-semibold mb-3">Features</h3>
                <ul className="space-y-2 text-sm list-disc list-inside">
                  <li>Automatic agent discovery from your project</li>
                  <li>Search across agent names, descriptions, tags, and categories</li>
                  <li>Category-based filtering</li>
                  <li>Visual canvas for organizing agents</li>
                  <li>Real-time prompt generation with token estimation</li>
                  <li>Copy to clipboard or download as markdown</li>
                </ul>
              </div>

              {/* CLI Commands */}
              <div>
                <h3 className="font-semibold mb-3">CLI Commands</h3>
                <pre className="text-xs bg-muted p-4 rounded-md overflow-auto">
{`# Scan and open UI
agent-composer scan ./project

# Scan without browser
agent-composer scan ./project --no-open

# Scan only, no server
agent-composer scan ./project --no-serve

# Custom port
agent-composer scan ./project --port 8080`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

function ShortcutRow({ keys, description }: { keys: string[]; description: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{description}</span>
      <div className="flex gap-1">
        {keys.map((key) => (
          <kbd
            key={key}
            className="px-2 py-1 text-xs font-mono bg-muted rounded border border-border"
          >
            {key}
          </kbd>
        ))}
      </div>
    </div>
  );
}
