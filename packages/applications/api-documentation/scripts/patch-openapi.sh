#!/usr/bin/env bash

# This script patches the generated code to add "as const", for better type inference
target_file="src/generated/http/openapi3.ts"
sed -i '$ s/};$/} as const;/' "$target_file"
