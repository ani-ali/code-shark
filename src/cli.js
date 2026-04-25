#!/usr/bin/env node

const yargs = require('yargs');
const chalk = require('chalk');
const CodeRemoverIdle = require('./index');
const path = require('path');

const argv = yargs
  .usage('Usage: $0 [options]')
  .option('path', {
    alias: 'p',
    type: 'string',
    description: 'Root path to watch for files',
    default: process.cwd()
  })
  .option('idle-time', {
    alias: 'i',
    type: 'number',
    description: 'Idle time in seconds before removing a line',
    default: 60
  })
  .option('dry-run', {
    alias: 'd',
    type: 'boolean',
    description: 'Simulate removals without actually modifying files',
    default: false
  })
  .option('max-removals', {
    alias: 'm',
    type: 'number',
    description: 'Maximum number of lines to remove (default: unlimited)',
    default: Infinity
  })
  .option('backup-dir', {
    alias: 'b',
    type: 'string',
    description: 'Directory to store backup files',
    default: path.join(process.cwd(), '.code-remover-backups')
  })
  .option('interactive', {
    type: 'boolean',
    description: 'Run in interactive mode with activity simulation',
    default: false
  })
  .example('$0', 'Start with default settings (60s idle time)')
  .example('$0 --idle-time 30', 'Set idle time to 30 seconds')
  .example('$0 --dry-run', 'Run in dry-run mode (no actual changes)')
  .example('$0 --max-removals 5', 'Stop after removing 5 lines')
  .example('$0 --path ./src', 'Watch only the src directory')
  .example('$0 --interactive', 'Run with keyboard activity detection')
  .help()
  .alias('help', 'h')
  .argv;

// Convert idle time from seconds to milliseconds
const idleTimeMs = argv['idle-time'] * 1000;

// Create and start the shark
const shark = new CodeRemoverIdle({
  rootPath: path.resolve(argv.path),
  idleTime: idleTimeMs,
  dryRun: argv['dry-run'],
  maxRemovals: argv['max-removals'],
  backupDir: argv['backup-dir']
});

console.log(chalk.red.bold(`
╔═══════════════════════════════════════════════╗
║        🦈 CODE SHARK - WARNING 🦈            ║
║                                               ║
║  A predator is circling your codebase!       ║
║  It will DEVOUR lines of code when idle!     ║
║                                               ║
║  Before swimming with the shark:             ║
║  • Commit all changes to git                 ║
║  • Create backups of important files         ║
║  • Know that you're swimming at your own risk║
║                                               ║
║  Press Ctrl+C to escape the water.           ║
╚═══════════════════════════════════════════════╝
`));

// If interactive mode, set up keyboard listener
if (argv.interactive) {
  console.log(chalk.cyan('Interactive mode enabled. Press any key to simulate activity.\n'));

  // Set up stdin for raw mode to detect keypresses
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', (key) => {
      // Ctrl+C to exit
      if (key === '\u0003') {
        shark.stop();
        process.exit(0);
      }

      // Any other key simulates activity
      console.log(chalk.gray('Activity detected - shark retreats'));
      shark.simulateActivity();
    });
  }
}

// Start the shark hunt
shark.start();

// Keep the process alive
process.stdin.resume();