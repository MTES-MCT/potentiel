#!/bin/bash

# Vérifier si le script est exécuté via npm
if [ "$npm_lifecycle_event" != "update:dump" ]; then
  echo "❌ Ce script ne peut être exécuté que via 'npm run update:dump'"
 
  echo "npm run update:dump" | pbcopy
  echo "📋 La commande a été copiée dans le presse-papier"
 
 
  exit 1
fi


docker exec -it potentiel_db pg_dump -U potentiel -Fc -b -v -f potentiel-dev.dump potentiel && docker cp potentiel_db:/potentiel-dev.dump ./.database/potentiel-dev.dump