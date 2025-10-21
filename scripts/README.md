# Scripts

This directory contains utility scripts for the Potentiel project.

## get-feature-tags.ts

This script parses all Cucumber/Gherkin feature files in `packages/specifications/src` and extracts distinct tags.

### Usage

Get all tags as a flat array:
```bash
npx tsx scripts/get-feature-tags.ts
```

Get tags chunked into groups for parallel execution:
```bash
npx tsx scripts/get-feature-tags.ts --chunks=3
```

### Output

The script outputs a JSON array of distinct tags (sorted alphabetically):

```json
["@abandon","@achèvement","@actionnaire","@cahier-des-charges",...]
```

With `--chunks=3`, it outputs an array of arrays:
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

This script is used in the GitHub Actions workflow (`.github/workflows/shared-workflow.yml`) to run Cucumber tests in a matrix with 3 parallel workers, where each worker runs tests for a subset of tags.
