# Scripts

This directory contains utility scripts for the Potentiel project.

## get-feature-tags.js / get-feature-tags.sh

These scripts parse all Cucumber/Gherkin feature files in `packages/specifications/src` and extract distinct tags.

Both scripts provide the same functionality - use whichever you prefer:
- **get-feature-tags.js**: JavaScript/Node.js version (used in GitHub Actions)
- **get-feature-tags.sh**: Bash version (requires `bash`, `grep`, and `jq`)

### Usage

JavaScript version:
```bash
node scripts/get-feature-tags.js
```

Bash version:
```bash
./scripts/get-feature-tags.sh
```

### Output

The scripts output a JSON array of distinct tags (sorted alphabetically):

```json
["@abandon","@achèvement","@actionnaire","@cahier-des-charges",...]
```

### Exit codes

- `0`: Success - all feature files have tags
- `1`: Error - one or more feature files are missing tags, or other error

### Requirements

All feature files must have a tag at the top of the file (after the `# language: fr` line). The scripts will exit with an error if any file is missing a tag.

### Integration with GitHub Actions

The JavaScript version is used in the GitHub Actions workflow (`.github/workflows/shared-workflow.yml`) to run Cucumber tests in a matrix, where each tag runs in a separate job for parallel execution.
