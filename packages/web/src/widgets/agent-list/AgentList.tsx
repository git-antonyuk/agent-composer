import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input, Button, Badge } from '@shared/ui';
import { AgentCard, AgentPreview } from '@entities/agent';
import { useAgentStore } from '@app/store/agents';
import type { Agent } from '@shared/types/agent';

export function AgentList() {
  const {
    searchQuery,
    categoryFilter,
    selectedIds,
    setSearchQuery,
    setCategoryFilter,
    toggleAgent,
    selectAll,
    deselectAll,
    getFilteredAgents,
  } = useAgentStore();

  const [selectedAgentForPreview, setSelectedAgentForPreview] = useState<Agent | null>(null);

  const filteredAgents = getFilteredAgents();
  const categories = Array.from(
    new Set(filteredAgents.map((a) => a.category).filter(Boolean))
  ).sort();

  const selectedCount = selectedIds.size;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Agent Library ({filteredAgents.length})
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={selectAll}
              disabled={filteredAgents.length === 0}
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={deselectAll}
              disabled={selectedCount === 0}
            >
              Deselect All ({selectedCount})
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agents by name, description, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filters */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={categoryFilter === null ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setCategoryFilter(null)}
            >
              All
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={categoryFilter === category ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setCategoryFilter(category || null)}
              >
                {category}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Agent List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredAgents.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <p className="text-muted-foreground">
                {searchQuery || categoryFilter
                  ? 'No agents match your search criteria'
                  : 'No agents found'}
              </p>
              {(searchQuery || categoryFilter) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter(null);
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1">
            {filteredAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isSelected={selectedIds.has(agent.id)}
                onToggleSelect={toggleAgent}
                onClick={() => setSelectedAgentForPreview(agent)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal (Simple implementation) */}
      {selectedAgentForPreview && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedAgentForPreview(null)}
        >
          <div
            className="bg-background rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
              <h3 className="font-semibold">Agent Preview</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedAgentForPreview(null)}
              >
                Close
              </Button>
            </div>
            <div className="p-4">
              <AgentPreview agent={selectedAgentForPreview} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
