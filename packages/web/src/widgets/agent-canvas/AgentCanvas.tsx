import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { AgentNode } from '@entities/agent';
import { useAgentStore } from '@app/store/agents';

const nodeTypes: NodeTypes = {
  agentNode: AgentNode,
};

export function AgentCanvas() {
  const { agents, selectedIds, toggleAgent } = useAgentStore();

  // Convert agents to nodes
  const initialNodes = useMemo(() => {
    return agents.map((agent, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);

      return {
        id: agent.id,
        type: 'agentNode',
        position: {
          x: col * 320 + 50,
          y: row * 180 + 50,
        },
        data: {
          agent,
          isSelected: selectedIds.has(agent.id),
        },
      } as Node;
    });
  }, [agents, selectedIds]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Update nodes when selection changes
  useMemo(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isSelected: selectedIds.has(node.id),
        },
      }))
    );
  }, [selectedIds, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      toggleAgent(node.id);
    },
    [toggleAgent]
  );

  if (agents.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-center p-8">
        <div>
          <p className="text-muted-foreground">
            No agents available for canvas view
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={4}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const data = node.data as { isSelected: boolean };
            return data.isSelected ? '#3b82f6' : '#e5e7eb';
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
}
