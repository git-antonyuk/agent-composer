#!/usr/bin/env bun
import { Command } from 'commander';
import { version } from '../package.json';
import { scanDirectory, formatScanResults, exportToJson } from './scanner';
import { startServer } from './server';
import type { ScanOptions } from './types';

const program = new Command();

program
  .name('agent-composer')
  .description('CLI tool for composing Claude Code agent workflows')
  .version(version);

program
  .command('scan')
  .description('Scan directory for agent files and open web UI')
  .argument('[directory]', 'Directory to scan', '.')
  .option('-p, --port <port>', 'Port for web server', '3456')
  .option('-w, --watch', 'Watch for file changes', false)
  .option('-o, --output <file>', 'Export results to JSON file')
  .option('--no-open', 'Don\'t auto-open browser')
  .option('--no-serve', 'Don\'t start web server, just scan and output')
  .action(async (directory: string, options) => {
    try {
      const scanOptions: ScanOptions = {
        directory,
        watch: options.watch,
        port: parseInt(options.port, 10),
      };

      // Scan directory
      const result = await scanDirectory(scanOptions);

      // Display results
      console.log(formatScanResults(result));

      // Export to JSON if requested
      if (options.output) {
        await exportToJson(result, options.output);
      }

      // Start web server if not disabled
      if (options.serve) {
        await startServer(result, parseInt(options.port, 10), {
          open: options.open,
        });
        // Server runs indefinitely, no need to exit
      } else {
        // Success (only exit if not serving)
        process.exit(0);
      }
    } catch (error) {
      console.error('\n❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();
