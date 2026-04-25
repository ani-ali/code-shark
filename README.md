<div align="center">
  <img src="https://code-shark.vercel.app/logo.png" alt="Code Shark Logo" width="200" height="200">

  # Code Shark 🦈

  ⚠️ **WARNING: This predator HUNTS and DEVOURS lines of code from your project!** ⚠️

  A chaos engineering tool that circles your codebase like a shark, waiting for moments of inactivity to strike and remove lines of code. Perfect for testing your error handling, recovery procedures, or swimming with danger.

  [![npm version](https://img.shields.io/npm/v/code-shark.svg)](https://www.npmjs.com/package/code-shark)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Website](https://img.shields.io/badge/Website-code--shark.vercel.app-blue)](https://code-shark.vercel.app)
</div>

## Features

- 🎯 Removes exactly ONE line of code per idle period
- 🔒 Automatically excludes configuration files
- 💾 Creates backups before removing lines
- 🏃 Dry-run mode for testing
- ⏱️ Configurable idle time
- 📁 Customizable root path
- 🎮 Interactive mode with activity detection

## Installation

```bash
npm install -g code-shark
```

Or run locally:

```bash
npm install
npm start
```

## Usage

### Basic Usage

```bash
code-shark
```

This starts the tool with default settings:
- Monitors current directory
- 60 seconds idle time
- Creates backups in `.code-remover-backups`

### Command Line Options

```bash
code-shark [options]
```

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--path` | `-p` | Root path to watch for files | Current directory |
| `--idle-time` | `-i` | Idle time in seconds before removing a line | 60 |
| `--dry-run` | `-d` | Simulate removals without modifying files | false |
| `--max-removals` | `-m` | Maximum number of lines to remove | Unlimited |
| `--backup-dir` | `-b` | Directory to store backup files | `.code-remover-backups` |
| `--interactive` | | Run with keyboard activity detection | false |
| `--help` | `-h` | Show help | |

### Examples

```bash
# Dry run to see what would happen
code-shark --dry-run

# Set idle time to 30 seconds
code-shark --idle-time 30

# Limit to 5 removals
code-shark --max-removals 5

# Watch only the src directory
code-shark --path ./src

# Interactive mode (press keys to prevent removal)
code-shark --interactive
```

## What Files Are Targeted?

### Included File Types
- JavaScript (`.js`, `.jsx`)
- TypeScript (`.ts`, `.tsx`)
- Python (`.py`)
- Java (`.java`)
- C/C++ (`.c`, `.cpp`)
- C# (`.cs`)
- PHP (`.php`)
- Ruby (`.rb`)
- Go (`.go`)
- Rust (`.rs`)
- Swift (`.swift`)
- Kotlin (`.kt`)
- Scala (`.scala`)
- Vue (`.vue`)
- Svelte (`.svelte`)

### Excluded Files
All configuration files are automatically excluded:
- `package.json`, `tsconfig.json`, `webpack.config.js`
- `.eslintrc`, `.prettierrc`, `.babelrc`
- `.env` files
- `Dockerfile`, `docker-compose.yml`
- Build configuration files
- And many more...

### Excluded Directories
- `node_modules`
- `.git`
- `dist`, `build`
- `coverage`
- `.vscode`, `.idea`
- And other common build/dependency directories

## Recovery

Backups are automatically created before each line removal. Find them in:
```
.code-remover-backups/
```

To restore a file:
```bash
cp .code-remover-backups/yourfile.js.2024-01-01T12-00-00.backup yourfile.js
```

## Safety Tips

1. **ALWAYS commit your code to git before running this tool**
2. Consider using `--dry-run` first to see what would happen
3. Use `--max-removals` to limit damage
4. Keep the `--backup-dir` accessible for recovery
5. Run in a test environment first

## Use Cases

- **Chaos Engineering**: Test your application's resilience
- **Error Handling Testing**: Verify your error boundaries work
- **Team Training**: Practice debugging and recovery
- **Code Review Games**: Find the removed line challenge
- **Living Dangerously**: Because why not?

## API Usage

```javascript
const CodeShark = require('code-shark');

const shark = new CodeShark({
  rootPath: './src',
  idleTime: 30000, // 30 seconds
  dryRun: true,
  maxRemovals: 10
});

shark.start();

// Simulate activity
shark.simulateActivity();

// Stop when done
shark.stop();

// Get history of removals
const history = shark.getHistory();
```

## License

MIT

## Disclaimer

This tool is provided as-is for testing and chaos engineering purposes. The authors are not responsible for any code loss, production outages, or existential crises resulting from its use. Please use responsibly and always maintain backups.

## Contributing

Issues and pull requests welcome at the GitHub repository.

Remember: With great power comes great responsibility. Use wisely! 🎭# code-shark
# code-shark
# code-shark
# code-shark
