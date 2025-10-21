#!/usr/bin/env tsx

/**
 * Script to extract distinct tags from Cucumber/Gherkin feature files
 *
 * This script:
 * - Parses all .feature files in packages/specifications/src
 * - Extracts the first tag (line starting with @ after # language: fr)
 * - Returns a JSON array of distinct tags or chunked arrays for parallel execution
 * - Exits with error code 1 if any file doesn't have a tag at the top
 *
 * Usage:
 *   node scripts/get-feature-tags.ts              # Returns flat array of tags
 *   node scripts/get-feature-tags.ts --chunks 3   # Returns array chunked into 3 groups
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Recursively find all .feature files in a directory
 */
function findFeatureFiles(dir: string): string[] {
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
function extractFirstTag(filePath: string): string | null {
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

/**
 * Chunk an array into smaller arrays
 */
function chunkArray<T>(array: T[], chunks: number): T[][] {
  const result: T[][] = [];
  const chunkSize = Math.ceil(array.length / chunks);

  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize;
    const chunk = array.slice(start, start + chunkSize);
    if (chunk.length > 0) {
      result.push(chunk);
    }
  }

  return result;
}

function main(): void {
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

  // Check if chunking is requested
  const chunksArg = process.argv.find((arg) => arg.startsWith('--chunks'));
  if (chunksArg) {
    const chunks = parseInt(chunksArg.split('=')[1], 10);
    if (isNaN(chunks) || chunks < 1) {
      console.error('Error: --chunks must be a positive integer');
      process.exit(1);
    }
    const chunkedTags = chunkArray(sortedTags, chunks);
    console.log(JSON.stringify(chunkedTags));
  } else {
    console.log(JSON.stringify(sortedTags));
  }
}

main();
