#! /usr/bin/env bash

# Crédits : https://github.com/betagouv/rdv-service-public/blob/production/scripts/create_review_app.rb

target_app=potentiel-dev
target_app_region=osc-fr1 

pr_number=$(gh pr view --json number --jq '.number')

review_app_name=$(echo "${target_app}-pr${pr_number}")
review_app_url="https://${review_app_name}.${target_app_region}.scalingo.io/"


if ! scalingo --app "$review_app_name" stats >/dev/null 2>&1; then
  echo "La review app n'existe pas, création en cours..."
  scalingo --region $target_app_region --app ${target_app} integration-link-manual-review-app "$pr_number"
fi

gh pr comment -b "[Review app](${review_app_url})" >/dev/null 2>&1
echo "L'application sera disponible à l'adresse ${review_app_url} une fois le déploiement terminé."
echo "Logs du déploiement: https://dashboard.scalingo.com/apps/${target_app_region}/${review_app_name}/deploy/list"
