import { readFile } from 'node:fs/promises';
import { resolve, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ScanResult } from '../types';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// MIME types for common files
const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

/**
 * Get the path to the built web assets
 */
function getWebDistPath(): string {
  // In development: packages/cli/src/server -> packages/web/dist
  // In production: the web assets should be bundled with the CLI
  const devPath = resolve(__dirname, '../../../web/dist');
  return devPath;
}

/**
 * Inject agent data into HTML
 */
function injectAgentData(html: string, scanResult: ScanResult): string {
  // Stringify and escape to prevent script tag injection
  const agentData = JSON.stringify(scanResult.agents)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
  const projectPath = JSON.stringify(scanResult.projectPath);

  // Inject into the script tag
  const injection = `<script>
      window.__AGENTS_DATA__ = ${agentData};
      window.__PROJECT_PATH__ = ${projectPath};
    </script>`;

  // Insert right after opening head tag, before any module scripts load
  // Use regex to handle any whitespace before/after head tag
  return html.replace(/(<head[^>]*>)/i, `$1\n${injection}`);
}

/**
 * Check if port is available
 */
async function isPortAvailable(port: number): Promise<boolean> {
  try {
    const server = Bun.serve({
      port,
      fetch: () => new Response('test'),
    });
    server.stop();
    return true;
  } catch {
    return false;
  }
}

/**
 * Find an available port starting from the preferred port
 */
export async function findAvailablePort(preferredPort: number): Promise<number> {
  let port = preferredPort;
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    if (await isPortAvailable(port)) {
      return port;
    }
    port++;
    attempts++;
  }

  throw new Error(
    `Could not find available port after ${maxAttempts} attempts starting from ${preferredPort}`
  );
}

/**
 * Open browser to a URL
 */
export async function openBrowser(url: string): Promise<void> {
  const { spawn } = await import('node:child_process');

  const commands: Record<string, string> = {
    darwin: 'open',
    win32: 'start',
    linux: 'xdg-open',
  };

  const command = commands[process.platform];
  if (!command) {
    console.warn('Could not detect platform to open browser');
    return;
  }

  try {
    spawn(command, [url], { detached: true, stdio: 'ignore' }).unref();
  } catch (error) {
    console.warn('Could not open browser:', error);
  }
}

/**
 * Start web server
 */
export async function startServer(
  scanResult: ScanResult,
  port: number,
  options: { open?: boolean } = {}
): Promise<void> {
  const webDistPath = getWebDistPath();

  // Read index.html and inject data
  const indexPath = join(webDistPath, 'index.html');
  const indexHtml = await readFile(indexPath, 'utf-8');
  const injectedHtml = injectAgentData(indexHtml, scanResult);

  console.log(`\n🚀 Starting web server...`);
  console.log(`📂 Serving from: ${webDistPath}`);

  // Find available port
  const actualPort = await findAvailablePort(port);
  if (actualPort !== port) {
    console.log(`⚠️  Port ${port} is busy, using ${actualPort} instead`);
  }

  const server = Bun.serve({
    port: actualPort,
    async fetch(req) {
      const url = new URL(req.url);
      let filePath = url.pathname;

      // Serve index.html for root
      if (filePath === '/' || filePath === '/index.html') {
        return new Response(injectedHtml, {
          headers: { 'Content-Type': 'text/html' },
        });
      }

      // Serve static assets
      try {
        const fullPath = join(webDistPath, filePath);
        const file = await readFile(fullPath);
        const ext = extname(filePath);
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        return new Response(file, {
          headers: { 'Content-Type': contentType },
        });
      } catch {
        // Return 404
        return new Response('Not Found', { status: 404 });
      }
    },
  });

  const url = `http://localhost:${actualPort}`;

  console.log(`✅ Server running at ${url}`);
  console.log(`\n📊 Loaded ${scanResult.agents.length} agents from ${scanResult.projectPath}`);
  console.log(`\n💡 Press Ctrl+C to stop the server\n`);

  // Open browser if requested
  if (options.open) {
    console.log(`🌐 Opening browser...`);
    await openBrowser(url);
  }

  // Keep server running
  await new Promise(() => {}); // Never resolves, keeps server alive
}
