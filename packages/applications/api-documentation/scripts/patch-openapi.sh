#!/usr/bin/env bash

# This script patches the generated code to add "as const", for better type inference
target_file="src/generated/http/openapi3.ts"
sed '$ s/};$/} as const;/' "$target_file" > "$target_file.tmp" && mv "$target_file.tmp" "$target_file"
