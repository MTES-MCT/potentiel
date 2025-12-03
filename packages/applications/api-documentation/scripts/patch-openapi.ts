#!/usr/bin/env -S npm exec --offline tsx

/** This script patches the generated code to add "as const", for better type inference */

import fs from 'node:fs';

const targetFile = 'src/generated/http/openapi3.ts';

const contents = fs.readFileSync(targetFile, 'utf-8').split('\n');
// Modify the last non-empty line to add "as const"
if (contents.length > 0) {
  // Find the last non-empty line
  let lastLineIndex = contents.length - 1;
  while (lastLineIndex >= 0 && !contents[lastLineIndex].trim()) {
    lastLineIndex--;
  }

  if (lastLineIndex >= 0) {
    const lastLine = contents[lastLineIndex];

    // Add "as const" before the semicolon or at the end
    if (lastLine.includes('};')) {
      contents[lastLineIndex] = lastLine.replace('};', '} as const;');
    } else if (lastLine.trim()) {
      contents[lastLineIndex] = lastLine + ' as const';
    }
  }
}

// Write the modified content back to the file
fs.writeFileSync(targetFile, contents.join('\n'));
