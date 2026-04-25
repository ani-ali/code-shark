const IdleDetector = require('./idleDetector');
const FileFinder = require('./fileFinder');
const LineRemover = require('./lineRemover');
const chalk = require('chalk');

class CodeShark {
  constructor(options = {}) {
    this.idleTime = options.idleTime || 60000; // Default 1 minute
    this.rootPath = options.rootPath || process.cwd();
    this.dryRun = options.dryRun || false;
    this.maxRemovals = options.maxRemovals || Infinity;
    this.backupDir = options.backupDir;

    this.idleDetector = new IdleDetector(this.idleTime);
    this.fileFinder = new FileFinder(this.rootPath);
    this.lineRemover = new LineRemover({
      dryRun: this.dryRun,
      backupDir: this.backupDir
    });

    this.removalsCount = 0;
    this.isRunning = false;
    this.removalHistory = [];
  }

  async start() {
    if (this.isRunning) {
      console.log(chalk.yellow('Code Remover is already running.'));
      return;
    }

    this.isRunning = true;
    console.log(chalk.cyan('='.repeat(50)));
    console.log(chalk.cyan.bold('Code Remover Idle - Started'));
    console.log(chalk.cyan('='.repeat(50)));
    console.log(chalk.white(`Root Path: ${this.rootPath}`));
    console.log(chalk.white(`Idle Time: ${this.idleTime / 1000} seconds`));
    console.log(chalk.white(`Dry Run: ${this.dryRun}`));
    console.log(chalk.white(`Max Removals: ${this.maxRemovals === Infinity ? 'Unlimited' : this.maxRemovals}`));
    console.log(chalk.cyan('='.repeat(50)));

    if (this.dryRun) {
      console.log(chalk.yellow.bold('DRY RUN MODE - No files will be actually modified'));
      console.log(chalk.cyan('='.repeat(50)));
    }

    // Set up idle event handler
    this.idleDetector.on('idle', async () => {
      await this.performRemoval();

      // Check if we've reached max removals
      if (this.removalsCount >= this.maxRemovals) {
        console.log(chalk.green(`Reached maximum removals (${this.maxRemovals}). Stopping...`));
        this.stop();
      } else {
        // Reset the timer for next idle period
        this.idleDetector.resetTimer();
      }
    });

    this.idleDetector.start();

    // Handle process termination
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\nReceived SIGINT, gracefully shutting down...'));
      this.stop();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log(chalk.yellow('\nReceived SIGTERM, gracefully shutting down...'));
      this.stop();
      process.exit(0);
    });
  }

  async performRemoval() {
    try {
      console.log(chalk.magenta('\n🔥 System is idle - Removing a line of code...'));

      // Find a random eligible file
      const targetFile = await this.fileFinder.getRandomFile();

      if (!targetFile) {
        console.log(chalk.yellow('No eligible files found to remove lines from.'));
        return;
      }

      // Remove a random line from the file
      const result = await this.lineRemover.removeRandomLine(targetFile);

      if (result) {
        this.removalsCount++;
        this.removalHistory.push(result);

        console.log(chalk.green('✂️  Line removed successfully!'));
        console.log(chalk.white(`   File: ${result.file}`));
        console.log(chalk.white(`   Line #${result.lineNumber}: ${chalk.strikethrough(result.removedContent)}`));

        if (result.backupPath) {
          console.log(chalk.gray(`   Backup: ${result.backupPath}`));
        }

        if (result.dryRun) {
          console.log(chalk.yellow(`   (DRY RUN - No actual changes made)`));
        }

        console.log(chalk.cyan(`   Total removals: ${this.removalsCount}`));
      }
    } catch (error) {
      console.error(chalk.red(`Error during removal: ${error.message}`));
    }
  }

  simulateActivity() {
    this.idleDetector.activity();
  }

  stop() {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    this.idleDetector.stop();

    console.log(chalk.cyan('\n' + '='.repeat(50)));
    console.log(chalk.cyan.bold('Code Remover Idle - Stopped'));
    console.log(chalk.white(`Total lines removed: ${this.removalsCount}`));
    console.log(chalk.cyan('='.repeat(50)));

    if (this.removalHistory.length > 0 && !this.dryRun) {
      console.log(chalk.yellow('\nBackup files are stored in:'));
      console.log(chalk.white(this.lineRemover.backupDir));
    }
  }

  getHistory() {
    return this.removalHistory;
  }
}

module.exports = CodeShark;