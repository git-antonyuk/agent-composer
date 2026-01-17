# Agent Composer

A visual tool for composing Claude Code agent workflows. Discover agent instruction files in your project, compose them visually, and generate optimized prompts.

## Features

- **Automatic Agent Discovery** - Scans your project for CLAUDE.md, AGENTS.md, agents/*.md, and skills/*.md files
- **Dual View Modes** - Switch between List view and Visual Canvas view
- **Smart Search & Filtering** - Search across names, descriptions, tags, and filter by category
- **Real-time Prompt Generation** - See your mega-prompt update as you select agents
- **Token Estimation** - Track estimated token usage for your prompts
- **Copy & Download** - Copy to clipboard or download as markdown file
- **Keyboard Shortcuts** - Fast navigation with Ctrl+K, Ctrl+Shift+A, and more
- **Visual Canvas** - Organize agents spatially with ReactFlow
- **Feature-Sliced Design** - Clean, maintainable codebase architecture
- **Zero Configuration** - Just run the CLI and start composing

## Architecture

**Hybrid CLI + Web UI**
- CLI tool scans your project with full file system access
- Serves a local web UI pre-loaded with agent data
- No complex backend needed

## Project Structure

```
agent-composer/
├── packages/
│   ├── cli/          # Bun CLI tool for scanning and serving
│   └── web/          # React web UI (Feature-Sliced Design)
└── docs/             # Documentation
```

## Development Setup

### Prerequisites

- [Bun](https://bun.sh) >= 1.0.0
- Node.js >= 18.0.0 (for compatibility)

### Installation

```bash
# Install dependencies for all packages
bun install

# Development mode
bun run dev:web    # Start web UI in dev mode
bun run dev:cli    # Run CLI in dev mode

# Build
bun run build      # Build all packages
bun run build:web  # Build web UI only
bun run build:cli  # Build CLI only
```

### Running the CLI

```bash
# Scan and open web UI (default)
bun run cli scan ./path/to/project

# Scan without opening browser
bun run cli scan ./path/to/project --no-open

# Scan only, don't start server
bun run cli scan ./path/to/project --no-serve

# Export results to JSON
bun run cli scan ./path/to/project --no-serve --output agents.json

# Use custom port
bun run cli scan ./path/to/project --port 8080

# Run built version
packages/cli/dist/cli.js scan ./path/to/project

# See all options
bun run cli scan --help
```

**Available Options:**
- `-p, --port <port>` - Port for web server (default: 3456)
- `--no-open` - Don't auto-open browser
- `--no-serve` - Don't start web server, just scan and output
- `-o, --output <file>` - Export scan results to JSON file
- `-w, --watch` - Watch for file changes (coming soon)

## Implementation Status

- [x] Phase 0: Project Setup (Complete)
- [x] Phase 1: CLI Scanner (Complete)
  - [x] Recursive directory walker
  - [x] Pattern matching for agent files
  - [x] Frontmatter parsing
  - [x] Metadata extraction
  - [x] Formatted console output
  - [x] JSON export
- [x] Phase 2: Web Server (Complete)
  - [x] Bun HTTP server serving static files
  - [x] HTML injection with agent data
  - [x] Port conflict handling
  - [x] Browser auto-open
  - [x] CLI integration
- [x] Phase 3: Simple List UI (Complete)
  - [x] Agent card components with metadata
  - [x] Search and filter functionality
  - [x] Category filtering
  - [x] Agent preview modal
  - [x] Selection with checkboxes
  - [x] Prompt generation
  - [x] Copy to clipboard
  - [x] Download as markdown
  - [x] Zustand state management
- [x] Phase 4: Visual Canvas UI (Complete)
  - [x] ReactFlow integration
  - [x] Agent nodes with visual styling
  - [x] Drag and drop positioning
  - [x] View mode toggle (List/Canvas)
  - [x] Selection sync with prompt generation
  - [x] Minimap and controls
- [x] Phase 5: Polish (Complete)
  - [x] Keyboard shortcuts (Ctrl+K, Ctrl+Shift+A, etc.)
  - [x] Help modal with shortcuts documentation
  - [x] Empty states with helpful messages
  - [x] Error handling
  - [x] Responsive design

## Tech Stack

### CLI
- Bun runtime
- Commander.js (CLI framework)
- gray-matter (frontmatter parsing)
- chokidar (file watching)

### Web UI
- React 18
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- Zustand (state management)
- @xyflow/react (canvas)
- Feature-Sliced Design (architecture)

## Feature-Sliced Design Structure

```
packages/web/src/
├── app/              # Application initialization
├── widgets/          # Complex UI blocks
├── features/         # User interactions
├── entities/         # Business entities
└── shared/           # Shared infrastructure
```

## Contributing

This is a POC project. See `AGENT_COMPOSER_MINIMAL_POC.md` for the full implementation plan.

## License

MIT
