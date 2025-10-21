# Scripts

This directory contains utility scripts for the Potentiel project.

## get-feature-tags.js

This script parses all Cucumber/Gherkin feature files in `packages/specifications/src` and extracts distinct tags.

### Usage

```bash
node scripts/get-feature-tags.js
```

### Output

The script outputs a JSON array of distinct tags (sorted alphabetically):

```json
["@abandon","@achèvement","@actionnaire","@cahier-des-charges",...]
```

### Exit codes

- `0`: Success - all feature files have tags
- `1`: Error - one or more feature files are missing tags, or other error

### Requirements

All feature files must have a tag at the top of the file (after the `# language: fr` line). The script will exit with an error if any file is missing a tag.

### Integration with GitHub Actions

This script is used in the GitHub Actions workflow (`.github/workflows/shared-workflow.yml`) to run Cucumber tests in a matrix, where each tag runs in a separate job for parallel execution.
