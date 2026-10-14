#!/usr/bin/env bash

set -e

# 🔍 Trouver la dernière branche release automatiquement
echo "🔍 Recherche de la dernière branche release..."
LATEST_RELEASE_BRANCH=$(gh api repos/:owner/:repo/branches\?protected=true\&per_page=100 | jq -r '[.[].name | select(test("^release/[0-9]+\\.[0-9]+$"))] | sort_by(.) | last')

if [[ -z "$LATEST_RELEASE_BRANCH" ]]; then
    echo "❌ Aucune branche release trouvée."
    exit 1
fi
# Fonction pour demander confirmation avec texte personnalisable
confirm_action() {
    local prompt_text="$1"
    local abort_text="$2"
    
    read -p "$prompt_text" yn
    if [[ ! "$yn" =~ ^[Yy]$ ]] && [[ -n "$yn" ]]; then
        echo "$abort_text"
        exit 1
    fi
}

confirm_action "✅ Dernière branche release détectée : $LATEST_RELEASE_BRANCH. Ok ? (Y/n) : " "❌ Arrêt du script."


RELEASE_BRANCH="$LATEST_RELEASE_BRANCH"
BRANCH_NAME="integrate-changes-${RELEASE_BRANCH//\//-}"

git checkout main
git fetch origin

# supprimer les branches locales si elles existent déjà
for branch in temp-main "$BRANCH_NAME"; do
    if git show-ref --verify --quiet "refs/heads/$branch"; then
        echo "⚠️ La branche locale '$branch' existe déjà."
        confirm_action "Veux-tu la supprimer ? (Y/n) : " "❌ Arrêt du script pour éviter les conflits."
        git branch -D "$branch"
        echo "✅ Branche '$branch' supprimée."
    fi
done

echo "🔁 Tentative de merge automatique vers main..."
git checkout -b temp-main origin/main
git fetch origin "$RELEASE_BRANCH:$RELEASE_BRANCH"
git merge "$RELEASE_BRANCH" --no-commit || CONFLICTS=true

if [[ "$CONFLICTS" == "true" ]]; then
    git merge --abort
    git checkout -b "$BRANCH_NAME" main
    git branch --delete temp-main
    git merge "$RELEASE_BRANCH" --no-commit
    echo "⚠️ Conflits détectés. Tu dois les résoudre manuellement."
    echo "Tu es maintenant sur la branche $BRANCH_NAME. Résous les conflits, commit avec :"
    echo "git commit -m '🔀 Résolution des conflits avec la branche $BRANCH_NAME'"
    echo "Puis appuie sur Entrée pour continuer."
    read

    git push -u origin $BRANCH_NAME
    gh pr create --title "🔀 Intégration des modifications de la release ${RELEASE_BRANCH#*/}" --body "Résolution manuelle des conflits de la release"
else
    echo "✅ Merge automatique réussi sans conflits."
    # git merge --abort
    git checkout -b "$BRANCH_NAME" "origin/$RELEASE_BRANCH"
    git branch -D temp-main
    git push -u origin $BRANCH_NAME
    gh pr create --base main --head $BRANCH_NAME --title "🔀 Intégration des modifications de la release ${RELEASE_BRANCH#*/}" --body ""
fi

echo "✅ PR créée avec succès."
gh pr merge --auto --merge

echo "🎉 Terminé !"
