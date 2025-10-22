# Scripts

This directory contains utility scripts for the Potentiel project.

## get-feature-tags.ts

This script parses all Cucumber/Gherkin feature files in `packages/specifications/src` and extracts distinct tags.

### Usage

Get tags chunked into groups for parallel execution (defaults to 3 workers):
```bash
npx tsx scripts/get-feature-tags.ts
```

Override the number of workers with environment variable:
```bash
SPECS_WORKERS=4 npx tsx scripts/get-feature-tags.ts
```

Or use command-line argument:
```bash
npx tsx scripts/get-feature-tags.ts --chunks=5
```

### Output

The script outputs an array of arrays (tags chunked by worker):

With default (3 workers):
```json
[
  ["@abandon","@achèvement","@actionnaire",...],
  ["@garanties-financières","@gestionnaire-réseau",...],
  ["@puissance","@période","@raccordement",...]
]
```

### Exit codes

- `0`: Success - all feature files have tags
- `1`: Error - one or more feature files are missing tags, or other error

### Requirements

All feature files must have a tag at the top of the file (after the `# language: fr` line). The script will exit with an error if any file is missing a tag.

### Integration with GitHub Actions

This script is used in the GitHub Actions workflow (`.github/workflows/shared-workflow.yml`) to run Cucumber tests in a matrix with parallel workers. The number of workers can be configured via the `SPECS_WORKERS` repository variable (defaults to 3 if not set).
