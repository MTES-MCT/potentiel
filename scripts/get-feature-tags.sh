#!/bin/bash

# Script to extract distinct tags from Cucumber/Gherkin feature files
# 
# This script:
# - Parses all .feature files in packages/specifications/src
# - Extracts the first tag (line starting with @ after # language: fr)
# - Returns a JSON array of distinct tags
# - Exits with error code 1 if any file doesn't have a tag at the top

set -euo pipefail

SPECS_DIR="$(dirname "$0")/../packages/specifications/src"

if [ ! -d "$SPECS_DIR" ]; then
    echo "Error: Specifications directory not found: $SPECS_DIR" >&2
    exit 1
fi

# Find all feature files
FEATURE_FILES=$(find "$SPECS_DIR" -name "*.feature" | sort)

if [ -z "$FEATURE_FILES" ]; then
    echo "Error: No feature files found" >&2
    exit 1
fi

# Arrays to store results
declare -a TAGS=()
declare -a FILES_WITHOUT_TAGS=()

# Process each feature file
while IFS= read -r file; do
    TAG=""
    
    # Read the file line by line
    while IFS= read -r line; do
        # Skip empty lines and comments
        if [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]]; then
            continue
        fi
        
        # Check if this line is a tag
        if [[ "$line" =~ ^[[:space:]]*@ ]]; then
            # Extract the first tag
            TAG=$(echo "$line" | grep -oP '@[^\s]+' | head -1)
            break
        fi
        
        # If we encounter a non-tag, non-comment line, stop looking
        break
    done < "$file"
    
    if [ -n "$TAG" ]; then
        TAGS+=("$TAG")
    else
        FILES_WITHOUT_TAGS+=("$file")
    fi
done <<< "$FEATURE_FILES"

# Check if any files are missing tags
if [ ${#FILES_WITHOUT_TAGS[@]} -gt 0 ]; then
    echo "Error: The following feature files are missing tags at the top:" >&2
    for file in "${FILES_WITHOUT_TAGS[@]}"; do
        echo "  - $file" >&2
    done
    exit 1
fi

# Get unique tags and sort them
UNIQUE_TAGS=$(printf '%s\n' "${TAGS[@]}" | sort -u)

# Convert to JSON array
echo -n "["
FIRST=true
while IFS= read -r tag; do
    if [ "$FIRST" = true ]; then
        FIRST=false
    else
        echo -n ","
    fi
    echo -n "\"$tag\""
done <<< "$UNIQUE_TAGS"
echo "]"
