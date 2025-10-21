#!/usr/bin/env node

/**
 * Script to extract distinct tags from Cucumber/Gherkin feature files
 *
 * This script:
 * - Parses all .feature files in packages/specifications/src
 * - Extracts the first tag (line starting with @ after # language: fr)
 * - Returns a JSON array of distinct tags
 * - Exits with error code 1 if any file doesn't have a tag at the top
 */

const fs = require('fs');
const path = require('path');

/**
 * Recursively find all .feature files in a directory
 */
function findFeatureFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findFeatureFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.feature')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Extract the first tag from a feature file
 * Returns null if no tag is found
 */
function extractFirstTag(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip empty lines and language declaration
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }

    // Check if this line is a tag
    if (trimmedLine.startsWith('@')) {
      // Extract the first tag (there might be multiple tags on the same line)
      const tags = trimmedLine.split(/\s+/).filter((t) => t.startsWith('@'));
      return tags[0];
    }

    // If we encounter a non-tag, non-comment line, stop looking
    break;
  }

  return null;
}

function main() {
  const specsDir = path.join(__dirname, '..', 'packages', 'specifications', 'src');

  if (!fs.existsSync(specsDir)) {
    console.error(`Error: Specifications directory not found: ${specsDir}`);
    process.exit(1);
  }

  const featureFiles = findFeatureFiles(specsDir);

  if (featureFiles.length === 0) {
    console.error('Error: No feature files found');
    process.exit(1);
  }

  const tags = new Set();
  const filesWithoutTags = [];

  for (const file of featureFiles) {
    const tag = extractFirstTag(file);

    if (tag) {
      tags.add(tag);
    } else {
      filesWithoutTags.push(path.relative(process.cwd(), file));
    }
  }

  // Check if any files are missing tags
  if (filesWithoutTags.length > 0) {
    console.error('Error: The following feature files are missing tags at the top:');
    filesWithoutTags.forEach((file) => console.error(`  - ${file}`));
    process.exit(1);
  }

  // Output the tags as a JSON array
  const sortedTags = Array.from(tags).sort();
  console.log(JSON.stringify(sortedTags));
}

main();
