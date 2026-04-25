const { glob } = require('glob');
const path = require('path');
const fs = require('fs');

class FileFinder {
  constructor(rootPath = process.cwd()) {
    this.rootPath = rootPath;

    // Common configuration file patterns to exclude
    this.configPatterns = [
      '*.config.js',
      '*.config.ts',
      '*.config.json',
      'package.json',
      'package-lock.json',
      'yarn.lock',
      'tsconfig.json',
      'jsconfig.json',
      '.eslintrc*',
      '.prettierrc*',
      '.babelrc*',
      'webpack.config.*',
      'rollup.config.*',
      'vite.config.*',
      'jest.config.*',
      'karma.conf.*',
      'Gruntfile.*',
      'gulpfile.*',
      '.gitignore',
      '.npmignore',
      '.env*',
      'Dockerfile*',
      'docker-compose.*',
      'Makefile',
      '*.yml',
      '*.yaml',
      '*.toml',
      '*.ini',
      'requirements.txt',
      'Gemfile*',
      'Cargo.toml',
      'go.mod',
      'go.sum',
      'composer.json',
      'phpunit.xml*'
    ];

    // Directories to ignore
    this.ignoreDirs = [
      'node_modules',
      '.git',
      'dist',
      'build',
      'coverage',
      '.next',
      '.nuxt',
      'vendor',
      'target',
      '__pycache__',
      '.pytest_cache',
      '.vscode',
      '.idea'
    ];

    // Code file extensions to include
    this.codeExtensions = [
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.py',
      '.java',
      '.cpp',
      '.c',
      '.cs',
      '.php',
      '.rb',
      '.go',
      '.rs',
      '.swift',
      '.kt',
      '.scala',
      '.vue',
      '.svelte'
    ];
  }

  isConfigFile(filePath) {
    const basename = path.basename(filePath);

    // Check if file matches any config pattern
    for (const pattern of this.configPatterns) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*').replace(/\./g, '\\.'));
      if (regex.test(basename)) {
        return true;
      }
    }

    return false;
  }

  isCodeFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return this.codeExtensions.includes(ext);
  }

  async findEligibleFiles() {
    const pattern = '**/*';
    const options = {
      cwd: this.rootPath,
      ignore: this.ignoreDirs.map(dir => `**/${dir}/**`),
      nodir: true,
      absolute: true
    };

    try {
      const files = await glob(pattern, options);

      // Filter out config files and non-code files
      const eligibleFiles = files.filter(file => {
        return this.isCodeFile(file) && !this.isConfigFile(file);
      });

      return eligibleFiles;
    } catch (err) {
      console.error('Error finding files:', err);
      return [];
    }
  }

  async getRandomFile() {
    const files = await this.findEligibleFiles();

    if (files.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * files.length);
    return files[randomIndex];
  }
}

module.exports = FileFinder;