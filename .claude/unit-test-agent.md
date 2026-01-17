---
name: Unit Test Agent
description: Specialized agent for creating comprehensive unit tests for core functionality
category: testing
tags: [unit-tests, testing, coverage, quality-assurance]
priority: high
---

# Unit Test Agent

## Purpose
This agent specializes in creating comprehensive unit tests for the Agent Composer 2 project's core functionality. Focus on high-value test coverage for critical business logic.

## Scope
**Target Coverage**: 80%+ for core scanner modules, 70%+ for server/CLI modules

### High Priority Modules

1. **Scanner Discovery** (`packages/cli/src/scanner/discover.ts`)
   - File pattern matching (`isAgentFile`)
   - Ignore patterns (`shouldIgnore`)
   - Recursive directory traversal (`walkDirectory`)
   - Full discovery orchestration (`discoverAgentFiles`)

2. **Parser** (`packages/cli/src/scanner/parser.ts`)
   - Frontmatter parsing (`parseAgentFile`)
   - Metadata extraction (`extractNameFromPath`, `extractDescription`, `inferCategory`)
   - Token estimation (`estimateTokens`)
   - ID generation (`generateId`)
   - Batch processing (`parseAgentFiles`)

3. **Scanner Orchestration** (`packages/cli/src/scanner/index.ts`)
   - Complete scan workflow (`scanDirectory`)
   - Result formatting (`formatScanResults`)
   - JSON export (`exportToJson`)

### Medium Priority Modules

4. **Server** (`packages/cli/src/server/serve.ts`)
   - Port availability checking (`findAvailablePort`, `isPortAvailable`)
   - Data injection (`injectAgentData`)
   - Server lifecycle (`startServer`)

5. **CLI** (`packages/cli/src/cli.ts`)
   - Command parsing and validation
   - Option handling
   - Error handling and exit codes

6. **Web Utilities** (`packages/web/src/shared/lib/utils.ts`)
   - File size formatting (`formatFileSize`)
   - Date formatting (`formatDate`)
   - Token estimation (`estimateTokens`)
   - Class name merging (`cn`)

## Test Strategy

### Test Framework
**Primary**: Bun's built-in test runner (already available with Bun runtime)
- Fast execution with native TypeScript support
- No additional dependencies required
- Built-in assertion library
- Code coverage reporting with `--coverage` flag

**Example test structure**:
```typescript
import { expect, test, describe } from "bun:test";

describe("Module name", () => {
  test("should do something", () => {
    // Arrange, Act, Assert
  });
});
```

### Test Organization
```
packages/cli/
├── src/
│   ├── scanner/
│   │   ├── discover.ts
│   │   ├── discover.test.ts       # New
│   │   ├── parser.ts
│   │   ├── parser.test.ts         # New
│   │   └── index.test.ts          # New
│   ├── server/
│   │   ├── serve.ts
│   │   └── serve.test.ts          # New
│   └── cli.test.ts                # New
```

### Test Coverage Requirements

#### 1. Scanner Discovery Tests (`discover.test.ts`)

**Pattern Matching Tests**:
- ✅ Match `CLAUDE.md` in root
- ✅ Match `AGENTS.md` in root
- ✅ Match `agents/*.md` files
- ✅ Match `skills/*.md` files
- ✅ Match `.claude/*.md` files
- ✅ Match nested patterns (`agents/subfolder/*.md`)
- ❌ Reject non-markdown files
- ❌ Reject files without proper extensions

**Ignore Pattern Tests**:
- ✅ Ignore `node_modules/`
- ✅ Ignore `.git/`
- ✅ Ignore build artifacts (`dist/`, `build/`, `.next/`)
- ✅ Ignore test/coverage directories
- ✅ Case-insensitive matching
- ✅ Path normalization (Windows vs Unix)

**Directory Traversal Tests**:
- ✅ Traverse nested directories
- ✅ Handle empty directories
- ✅ Handle permission errors gracefully
- ✅ Handle symlinks appropriately
- ✅ Respect maximum depth limits (if implemented)
- ✅ Handle large directory trees efficiently

**Integration Tests**:
- ✅ Discover all agent types in test project
- ✅ Return correct file paths (absolute/relative)
- ✅ Include file stats (size, modified time)
- ✅ Handle non-existent directories
- ✅ Handle invalid paths

#### 2. Parser Tests (`parser.test.ts`)

**Frontmatter Parsing Tests**:
- ✅ Parse valid YAML frontmatter
- ✅ Handle missing frontmatter gracefully
- ✅ Handle malformed YAML
- ✅ Extract all expected fields (name, description, category, tags, priority)
- ✅ Apply correct defaults when fields missing
- ✅ Handle empty frontmatter blocks

**Content Extraction Tests**:
- ✅ Extract first paragraph as description
- ✅ Truncate long descriptions appropriately
- ✅ Handle markdown formatting in descriptions
- ✅ Handle files with no content
- ✅ Handle files with only frontmatter

**Name Extraction Tests**:
- ✅ Generate name from filename (`test-agent.md` → "Test Agent")
- ✅ Handle special files (`CLAUDE.md` → "Claude Instructions")
- ✅ Handle `AGENTS.md` → "App Agents"
- ✅ Handle kebab-case → Title Case conversion
- ✅ Handle underscores and special characters

**Category Inference Tests**:
- ✅ Infer "agent" for `agents/` directory
- ✅ Infer "skill" for `skills/` directory
- ✅ Infer "instructions" for root files
- ✅ Default to "other" for unknown patterns

**Token Estimation Tests**:
- ✅ Estimate tokens for various content lengths
- ✅ Use ~4 characters per token heuristic
- ✅ Handle empty content (0 tokens)
- ✅ Handle very large files

**ID Generation Tests**:
- ✅ Generate unique IDs from file paths
- ✅ Slugify paths correctly
- ✅ Handle special characters
- ✅ Ensure ID uniqueness for different paths

**Batch Processing Tests**:
- ✅ Parse multiple files successfully
- ✅ Handle mix of valid and invalid files
- ✅ Return correct array of parsed agents
- ✅ Handle empty file lists

**Error Handling Tests**:
- ✅ Handle missing files gracefully
- ✅ Handle unreadable files
- ✅ Return meaningful error information
- ✅ Continue processing on individual file errors

#### 3. Scanner Orchestration Tests (`index.test.ts`)

**Scan Workflow Tests**:
- ✅ Complete end-to-end scan
- ✅ Discover and parse all agents
- ✅ Sort results by category
- ✅ Handle empty projects
- ✅ Handle projects with only one agent type

**Result Formatting Tests**:
- ✅ Format results with proper headers
- ✅ Group by category correctly
- ✅ Display accurate statistics
- ✅ Handle empty result sets
- ✅ Emoji rendering (optional)

**JSON Export Tests**:
- ✅ Export valid JSON
- ✅ Include all required fields
- ✅ Handle special characters in content
- ✅ Validate JSON schema
- ✅ Create output files successfully

#### 4. Server Tests (`serve.test.ts`)

**Port Management Tests**:
- ✅ Find available ports
- ✅ Increment port on conflict
- ✅ Respect max attempts
- ✅ Check port availability correctly
- ✅ Handle port range limits

**Data Injection Tests**:
- ✅ Inject JSON data correctly
- ✅ Escape special characters
- ✅ Inject project path
- ✅ Handle empty agent arrays
- ✅ Preserve HTML structure

**Server Lifecycle Tests** (Integration):
- ✅ Start server successfully
- ✅ Serve static assets
- ✅ Return correct MIME types
- ✅ Handle 404s gracefully
- ✅ Shut down cleanly

#### 5. CLI Tests (`cli.test.ts`)

**Command Parsing Tests**:
- ✅ Parse `scan` command
- ✅ Parse directory argument
- ✅ Parse options (--port, --output, --no-serve, --no-open)
- ✅ Handle default values
- ✅ Validate port numbers

**Error Handling Tests**:
- ✅ Handle invalid directories
- ✅ Handle invalid port numbers
- ✅ Exit with correct codes
- ✅ Display helpful error messages

#### 6. Web Utils Tests (`utils.test.ts`)

**File Size Formatting Tests**:
- ✅ Format bytes (0-999 B)
- ✅ Format kilobytes (1-999 KB)
- ✅ Format megabytes (1+ MB)
- ✅ Handle edge cases (0 bytes, very large)
- ✅ Correct decimal precision

**Date Formatting Tests**:
- ✅ Format dates correctly
- ✅ Handle different locales
- ✅ Handle invalid dates

**Class Name Merging Tests**:
- ✅ Merge Tailwind classes
- ✅ Resolve conflicts (later wins)
- ✅ Handle conditional classes

## Test Implementation Guidelines

### 1. Test Structure
Follow the **Arrange-Act-Assert** pattern:
```typescript
test("should parse valid frontmatter", () => {
  // Arrange
  const filePath = "/test/agent.md";
  const content = "---\nname: Test\n---\nContent";

  // Act
  const result = parseAgentFile(filePath, content);

  // Assert
  expect(result.name).toBe("Test");
});
```

### 2. Test Fixtures
Create reusable test data in `__fixtures__` directories:
```
packages/cli/src/__fixtures__/
├── valid-frontmatter.md
├── invalid-frontmatter.md
├── no-frontmatter.md
└── sample-project/
    ├── CLAUDE.md
    ├── agents/
    └── skills/
```

### 3. Mocking Strategy
- **File System**: Mock with in-memory implementations
- **Network**: Mock HTTP requests (if needed)
- **Time**: Use fixed timestamps for date tests
- **Process**: Mock `process.exit` and `console` methods

### 4. Edge Cases to Test
- Empty inputs (empty strings, empty arrays, empty objects)
- Null/undefined values
- Very large inputs (stress tests)
- Invalid data types
- Boundary conditions (max/min values)
- Special characters and Unicode
- Path separators (Windows vs Unix)

### 5. Test Naming Convention
Use descriptive names that explain the scenario:
```typescript
describe("parseAgentFile", () => {
  test("should extract name from frontmatter when present", () => {});
  test("should generate name from filename when frontmatter missing", () => {});
  test("should return error for non-existent files", () => {});
});
```

## Running Tests

### Commands to Add to `package.json`
```json
{
  "scripts": {
    "test": "bun test",
    "test:watch": "bun test --watch",
    "test:coverage": "bun test --coverage",
    "test:cli": "cd packages/cli && bun test",
    "test:web": "cd packages/web && bun test"
  }
}
```

### Coverage Goals
- **Overall**: 75%+ line coverage
- **Core Scanner**: 80%+ line coverage
- **Parser**: 85%+ line coverage
- **Server**: 70%+ line coverage
- **Utils**: 80%+ line coverage

## Success Criteria
- ✅ All core modules have comprehensive unit tests
- ✅ Coverage goals met for each module
- ✅ Tests run in <5 seconds for fast feedback
- ✅ No flaky tests (consistent pass/fail)
- ✅ Edge cases and error paths covered
- ✅ Tests serve as documentation for expected behavior

## Dependencies Required
**None** - Bun's built-in test runner is sufficient. No additional test libraries needed.

## Next Steps After Agent Creation
1. Start with **Parser tests** (highest value, lowest complexity)
2. Then **Discovery tests** (more complex, uses filesystem)
3. Then **Scanner orchestration tests** (integration)
4. Then **Server tests** (may require more mocking)
5. Then **CLI tests** (integration tests)
6. Finally **Utils tests** (straightforward)

## Notes
- Use TDD approach when adding new features
- Run tests before commits
- Keep tests focused and isolated
- Mock external dependencies
- Prefer integration tests for complex workflows
- Document tricky test scenarios with comments
