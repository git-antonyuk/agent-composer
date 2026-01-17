import { create } from 'zustand';
import type { Agent } from '@shared/types/agent';

interface AgentStore {
  // All agents loaded from CLI
  agents: Agent[];

  // Selected agent IDs
  selectedIds: Set<string>;

  // Search and filter state
  searchQuery: string;
  categoryFilter: string | null;

  // Actions
  setAgents: (agents: Agent[]) => void;
  toggleAgent: (agentId: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string | null) => void;

  // Computed
  getSelectedAgents: () => Agent[];
  getFilteredAgents: () => Agent[];
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  agents: [],
  selectedIds: new Set(),
  searchQuery: '',
  categoryFilter: null,

  setAgents: (agents) => set({ agents }),

  toggleAgent: (agentId) =>
    set((state) => {
      const newSelectedIds = new Set(state.selectedIds);
      if (newSelectedIds.has(agentId)) {
        newSelectedIds.delete(agentId);
      } else {
        newSelectedIds.add(agentId);
      }
      return { selectedIds: newSelectedIds };
    }),

  selectAll: () =>
    set((state) => {
      const filteredAgents = get().getFilteredAgents();
      const newSelectedIds = new Set(state.selectedIds);
      filteredAgents.forEach((agent) => newSelectedIds.add(agent.id));
      return { selectedIds: newSelectedIds };
    }),

  deselectAll: () => set({ selectedIds: new Set() }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setCategoryFilter: (category) => set({ categoryFilter: category }),

  getSelectedAgents: () => {
    const { agents, selectedIds } = get();
    return agents.filter((agent) => selectedIds.has(agent.id));
  },

  getFilteredAgents: () => {
    const { agents, searchQuery, categoryFilter } = get();

    return agents.filter((agent) => {
      // Category filter
      if (categoryFilter && agent.category !== categoryFilter) {
        return false;
      }

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = agent.name.toLowerCase().includes(query);
        const matchesDescription = agent.description
          .toLowerCase()
          .includes(query);
        const matchesTags = agent.tags?.some((tag) =>
          tag.toLowerCase().includes(query)
        );
        const matchesCategory = agent.category
          ?.toLowerCase()
          .includes(query);

        return matchesName || matchesDescription || matchesTags || matchesCategory;
      }

      return true;
    });
  },
}));
