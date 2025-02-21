#!/bin/bash

# Vérifier si le script est exécuté via npm
if [ "$npm_lifecycle_event" != "update:dump-metabase" ]; then
  echo "❌ Ce script ne peut être exécuté que via 'npm run update:dump-metabase'"
  
  echo "npm run update:dump-metabase" | pbcopy
  echo "📋 La commande a été copiée dans le presse-papier"
  
  exit 1
fi



docker exec -it potentiel_db pg_dump -U metabase -Fc -b -v -f metabase-dev.dump metabase && docker cp potentiel_db:/metabase-dev.dump ./.database/metabase-dev.dump
