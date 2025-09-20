# Scripts Directory

This directory contains utility scripts for the New Rainbow Sanctuary Bazu project.

## check-js-syntax.js

A comprehensive JavaScript syntax checker that validates all JavaScript files in the project.

### Features

- ✅ Recursively checks all `.js` files in the `js/` directory and subdirectories
- ✅ Provides detailed error reporting with file paths and line numbers
- ✅ Returns proper exit codes for CI/CD integration
- ✅ Color-coded output for easy visual feedback

### Usage

```bash
# Direct execution
node scripts/check-js-syntax.js

# Using npm script
npm run syntax-check

# Using in CI/CD
npm test  # includes syntax check
```

### Exit Codes

- `0`: All files have valid syntax
- `1`: One or more files have syntax errors or script execution failed

### Example Output

```
Checking JavaScript files for basic syntax...
Checking /path/to/js/ai-story-generator.js...
✅ /path/to/js/ai-story-generator.js syntax is valid
Checking /path/to/js/ai-narrative.js...
✅ /path/to/js/ai-narrative.js syntax is valid
...
🎉 All JavaScript files have valid syntax!
```

## Integration

This script is automatically run by:

- ✅ GitHub Actions PR validation workflow
- ✅ `npm test` command
- ✅ Manual execution for development

## Maintenance

The script is designed to be:
- Zero-dependency (only uses Node.js built-in modules)
- Cross-platform compatible
- Easy to extend for additional validation rules