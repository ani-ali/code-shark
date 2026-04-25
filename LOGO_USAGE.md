# Logo Usage Guide

## Your Logo is Now Ready for GitHub and npm! 🦈

### Current Setup
Your README now uses the logo from your deployed website:
- **URL**: `https://code-shark.vercel.app/logo.png`
- This works everywhere: GitHub, npm, and any other platform

### Alternative Options

#### Option 1: GitHub Raw URL (After pushing to GitHub)
Once you push your `logo.png` to GitHub, you can also use:
```markdown
![Code Shark Logo](https://raw.githubusercontent.com/ani-ali/code-shark/main/logo.png)
```

#### Option 2: Relative Path (GitHub only)
For viewing directly on GitHub:
```markdown
![Code Shark Logo](./logo.png)
```

#### Option 3: Using Both (Fallback)
```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://code-shark.vercel.app/logo.png">
  <source media="(prefers-color-scheme: light)" srcset="https://code-shark.vercel.app/logo.png">
  <img src="https://code-shark.vercel.app/logo.png" alt="Code Shark Logo" width="200">
</picture>
```

### What's Been Added to Your README

1. **Logo Image**: Centered at the top, 200x200 pixels
2. **Badges**:
   - npm version badge
   - MIT License badge
   - Website link badge
3. **Centered Header**: Professional look with centered alignment

### Files Created
- `logo.png` - Copied to your main project directory
- Updated `README.md` - Now includes your logo and badges

### Next Steps
1. Commit the logo.png file:
   ```bash
   git add logo.png README.md
   git commit -m "Add logo to README"
   git push
   ```

2. The logo will automatically appear on:
   - GitHub repository page
   - npm package page (when you publish)
   - Any documentation that uses your README

### Logo Hosting
Your logo is hosted at: **https://code-shark.vercel.app/logo.png**
This URL is reliable and will work as long as your Vercel deployment is active.