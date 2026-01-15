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

echo "Le déploiement de la review app sera déclanché dès que la CI sera passée avec succès."
echo "Logs du déploiement: https://dashboard.scalingo.com/apps/${target_app_region}/${review_app_name}/deploy/list"
echo ""
echo "Une fois le déploiement terminé (et pas avant, sinon la DB ne sera pas restaurée), il est nécessaire de scale les containers web et worker à 1 pour que l'application fonctionne correctement:"
echo " scalingo --region ${target_app_region} --app ${review_app_name} scale web=1 worker=1"
echo ""
echo "L'application sera disponible à l'adresse ${review_app_url}."
