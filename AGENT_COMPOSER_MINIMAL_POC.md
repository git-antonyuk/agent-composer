# Agent Composer - Minimal POC Plan

## Architecture: Hybrid CLI + Web UI

**Concept**: A CLI tool that scans your project for Claude Code agent files, then serves a local web UI pre-loaded with all agent data.

### Why This Architecture?
- **CLI**: Full file system access, no browser permission prompts
- **Web UI**: Rich visual interface, familiar browser UX
- **No Backend**: CLI serves static assets + JSON data, no complex server needed
- **Simple Distribution**: `npx agent-composer` or `bun run agent-composer`

### Flow
```
$ agent-composer scan ./my-project
→ Scanning for agent files...
→ Found 12 agents
→ Starting web UI at http://localhost:3456
→ Opening browser...

[Browser opens with all agents pre-loaded]
```

---

## Minimal Feature Set (MVP)

### 1. CLI Scanner (Bun)
**What it does:**
- Scans directory for agent instruction files
- Parses frontmatter and content
- Generates JSON payload with all agent data
- Serves local web app with data embedded

**Discovery patterns:**
- `CLAUDE.md` (root instructions)
- `AGENTS.md` (app-specific)
- `agents/*.md` (individual agents)
- `skills/*.md` (skill definitions)
- Any `.md` with frontmatter metadata

**Output:**
```typescript
interface Agent {
  id: string;
  name: string;
  description: string;
  filePath: string;
  content: string;
  fileSize: number;
  tags?: string[];
  category?: string;
}
```

### 2. Web UI (React + Vite)

**Two modes in one app:**

#### Mode A: Simple List (Default)
- Searchable/filterable list of agents
- Checkboxes to select agents
- Preview pane showing selected agents
- "Generate Prompt" button

#### Mode B: Visual Canvas (Optional)
- Drag-drop interface using reactflow
- Visual composition of agent workflow
- Same output generation as Mode A
- Toggle button to switch between modes

### 3. Prompt Generator
**Input**: Selected agents (from either mode)
**Output**: Formatted prompt ready to copy

**Format:**
```markdown
# Agent Instructions

## Core Instructions (CLAUDE.md)
[content]

## Code Review Agent (agents/code-review.md)
[content]

## Testing Agent (agents/testing.md)
[content]

---
YOUR TASK:
[User fills this in after pasting]
```

**Actions:**
- Copy to clipboard
- Download as .md file

### 4. File Watcher (Nice to have)
- Watch for changes to agent files
- Hot-reload UI when files change
- Live sync during development

---

## Tech Stack (Final)

### CLI
- **Runtime**: Bun (fast, built-in file APIs)
- **CLI Framework**: commander or clack
- **File Parsing**: gray-matter (frontmatter)
- **Server**: Bun.serve() - native HTTP server

### Web UI
- **Framework**: React (Vite for build)
- **Styling**: Tailwind CSS + shadcn/ui
- **Canvas**: reactflow (only for Mode B)
- **State**: Zustand or React Context (keep it simple)
- **Search**: Native JS filter (no external lib needed)

### Build
- **CLI**: Bundle with `bun build` to single executable
- **Web**: `vite build` to static assets embedded in CLI
- **Package**: Single npm package with both

---

## Implementation Plan (Minimal)

### Phase 0: Project Setup (1 hour)
- [x] Initialize monorepo structure:
  ```
  agent-composer/
  ├── packages/
  │   ├── cli/          (Bun CLI tool)
  │   └── web/          (React UI)
  └── package.json
  ```
- [ ] Install dependencies
- [ ] Configure TypeScript
- [ ] Set up basic build scripts

### Phase 1: CLI Scanner (3-4 hours)
**Goal**: Working CLI that scans and outputs JSON

**Tasks:**
- [ ] Implement file scanner (recursive directory walk)
- [ ] Add pattern matching for agent files
- [ ] Parse frontmatter with gray-matter
- [ ] Extract metadata (name from frontmatter or filename)
- [ ] Generate agent data JSON
- [ ] Add CLI commands: `scan <directory>`

**Demo**: `agent-composer scan . --output agents.json`

### Phase 2: Static Web Server (2 hours)
**Goal**: CLI serves web UI with agent data

**Tasks:**
- [ ] Build basic React app (empty shell)
- [ ] Create Bun HTTP server
- [ ] Serve built React assets
- [ ] Inject agent data into HTML (window.__AGENTS_DATA__)
- [ ] Add auto-open browser
- [ ] Add port selection (default 3456)

**Demo**: CLI serves UI, shows "No agents" or pre-loaded data

### Phase 3: Simple List UI (4-5 hours)
**Goal**: List view with agent selection

**Tasks:**
- [ ] Create AgentList component
- [ ] Add search/filter input
- [ ] Add checkbox selection
- [ ] Create AgentCard with preview
- [ ] Build PromptPreview panel
- [ ] Add copy-to-clipboard button
- [ ] Add download as .md button

**Demo**: Select agents → see combined prompt → copy

### Phase 4: Visual Canvas UI (4-6 hours)
**Goal**: Drag-drop canvas alternative

**Tasks:**
- [ ] Integrate reactflow
- [ ] Create Canvas component
- [ ] Make agents draggable from list
- [ ] Add AgentNode component
- [ ] Sync canvas selection with prompt generator
- [ ] Add toggle between List/Canvas modes
- [ ] Add basic zoom/pan controls

**Demo**: Drag agents to canvas → generate same prompt

### Phase 5: Polish (2-3 hours)
**Goal**: Make it production-ready

**Tasks:**
- [ ] Add loading states
- [ ] Add error handling (directory not found, no agents)
- [ ] Add empty states with helpful messages
- [ ] Add keyboard shortcuts (Ctrl+C to copy)
- [ ] Add CLI help text and examples
- [ ] Basic responsive design
- [ ] Add version flag (`--version`)

**Total Estimated Time**: 16-21 hours (~2-3 focused days)

---

## File Structure

```
agent-composer/
├── packages/
│   ├── cli/
│   │   ├── src/
│   │   │   ├── scanner/
│   │   │   │   ├── discover.ts        # File discovery
│   │   │   │   ├── parser.ts          # Frontmatter parsing
│   │   │   │   └── index.ts
│   │   │   ├── server/
│   │   │   │   ├── serve.ts           # Web server
│   │   │   │   └── index.ts
│   │   │   ├── cli.ts                 # CLI entry point
│   │   │   └── types.ts               # Shared types
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/
│       ├── src/
│       │   ├── components/
│       │   │   ├── AgentList.tsx
│       │   │   ├── AgentCard.tsx
│       │   │   ├── Canvas.tsx
│       │   │   ├── AgentNode.tsx
│       │   │   └── PromptPreview.tsx
│       │   ├── store/
│       │   │   └── agents.ts          # Zustand store
│       │   ├── utils/
│       │   │   └── generator.ts       # Prompt generation
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── package.json
│       ├── vite.config.ts
│       └── index.html
│
├── package.json                        # Root package.json
└── README.md
```

---

## Data Flow

### 1. Scan & Load
```
User runs CLI
  → CLI scans directory
  → Parses all .md files
  → Generates agents JSON
  → Embeds in HTML template
  → Serves web app
  → Opens browser
```

### 2. UI Interaction (List Mode)
```
Browser loads with window.__AGENTS_DATA__
  → AgentList renders all agents
  → User searches/filters
  → User checks agents
  → Store updates selection
  → PromptPreview re-renders
  → User copies output
```

### 3. UI Interaction (Canvas Mode)
```
User toggles to Canvas mode
  → reactflow initializes
  → User drags AgentCard to Canvas
  → Canvas node created
  → Store updates selection (same as List)
  → PromptPreview stays in sync
  → User copies output
```

---

## Questions to Answer

### Before Implementation
1. **Monorepo or separate repos?** → Monorepo (easier development)
2. **Package name?** → `@agent-composer/cli` and `@agent-composer/web`
3. **Default port?** → 3456 (memorable, unlikely to conflict)
4. **Fallback if no frontmatter?** → Use filename as name, "No description" as placeholder
5. **Include file size in UI?** → Yes, helps understand context usage
6. **Support .txt or only .md?** → Only .md for MVP, easy to extend later

### During Development
1. Should canvas mode persist node positions? → No for MVP, just selection matters
2. Add token estimation? → Not in MVP, add in Phase 2
3. Support ignoring certain directories? → Yes, respect .gitignore
4. Allow custom output templates? → No for MVP, single format only

---

## Success Criteria

**MVP is successful if:**
- ✅ CLI scans a project and finds all agent .md files
- ✅ Web UI opens automatically with agents pre-loaded
- ✅ User can select agents via list OR canvas
- ✅ Generated prompt is valid and copyable
- ✅ Works on macOS, Linux, Windows

**Bonus points if:**
- File watcher updates UI on changes
- Canvas mode feels intuitive
- Generated prompts actually save time vs manual copy-paste

---

## Out of Scope (For Now)

### Not in MVP
- Workflow save/load (no persistence needed)
- Multi-project support (one project at a time)
- Agent relationships/dependencies
- Execution monitoring
- Cloud sync or sharing
- Authentication
- Agent templates
- Analytics

### Future Enhancements (Phase 2+)
- Save favorite agent combinations
- Git integration (track agent usage in commits)
- VS Code extension
- Claude Code MCP server integration
- Smart agent recommendations
- Token estimation and warnings
- Export as Claude Code skill file

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| reactflow too complex | Offer list mode as primary, canvas as optional |
| Port conflicts | Auto-increment port, allow --port flag |
| Large projects (1000s of files) | Add ignore patterns, limit scan depth |
| Windows path issues | Use path.normalize, test on Windows |
| Agent content too large | Show warning if >10k tokens estimated |

---

## Next Steps

1. **Now**: Review and approve this minimal plan
2. **Next**: Initialize project structure (Phase 0)
3. **Then**: Build CLI scanner (Phase 1) - most valuable part standalone
4. **Demo**: After each phase, test with real project

**Estimated Timeline**: 2-3 focused days for working MVP

---

**Document Version**: 2.0 (Minimal)
**Last Updated**: 2026-01-17
**Architecture**: Hybrid CLI + Web UI
**Status**: Ready for Implementation
