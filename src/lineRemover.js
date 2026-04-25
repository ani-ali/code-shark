const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');

class LineRemover {
  constructor(options = {}) {
    this.dryRun = options.dryRun || false;
    this.backupDir = options.backupDir || path.join(process.cwd(), '.code-remover-backups');
  }

  async ensureBackupDir() {
    if (!this.dryRun) {
      await fs.mkdir(this.backupDir, { recursive: true });
    }
  }

  async createBackup(filePath) {
    if (this.dryRun) {
      return null;
    }

    await this.ensureBackupDir();

    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const basename = path.basename(filePath);
    const backupName = `${basename}.${timestamp}.backup`;
    const backupPath = path.join(this.backupDir, backupName);

    const content = await fs.readFile(filePath, 'utf-8');
    await fs.writeFile(backupPath, content, 'utf-8');

    return backupPath;
  }

  async removeRandomLine(filePath) {
    try {
      // Read the file
      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.split('\n');

      if (lines.length === 0) {
        console.log(chalk.yellow(`File ${filePath} is empty, skipping.`));
        return null;
      }

      // Filter out empty lines for potential removal targets
      const nonEmptyLineIndices = [];
      lines.forEach((line, index) => {
        if (line.trim().length > 0) {
          nonEmptyLineIndices.push(index);
        }
      });

      if (nonEmptyLineIndices.length === 0) {
        console.log(chalk.yellow(`File ${filePath} contains only empty lines, skipping.`));
        return null;
      }

      // Select a random non-empty line to remove
      const randomIndex = Math.floor(Math.random() * nonEmptyLineIndices.length);
      const lineToRemove = nonEmptyLineIndices[randomIndex];
      const removedContent = lines[lineToRemove];

      // Create backup before modifying
      let backupPath = null;
      if (!this.dryRun) {
        backupPath = await this.createBackup(filePath);
      }

      // Remove the line
      lines.splice(lineToRemove, 1);

      // Write back to file
      if (!this.dryRun) {
        await fs.writeFile(filePath, lines.join('\n'), 'utf-8');
      }

      return {
        file: filePath,
        lineNumber: lineToRemove + 1, // Convert to 1-based indexing
        removedContent: removedContent,
        backupPath: backupPath,
        dryRun: this.dryRun
      };

    } catch (error) {
      console.error(chalk.red(`Error processing file ${filePath}: ${error.message}`));
      return null;
    }
  }

  async restoreFromBackup(backupPath, originalPath) {
    try {
      const content = await fs.readFile(backupPath, 'utf-8');
      await fs.writeFile(originalPath, content, 'utf-8');
      console.log(chalk.green(`Restored ${originalPath} from backup.`));
      return true;
    } catch (error) {
      console.error(chalk.red(`Error restoring backup: ${error.message}`));
      return false;
    }
  }
}

module.exports = LineRemover;