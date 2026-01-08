# Vues pour les statistiques

Ce répertoire regroupe les vues SQL servant à calculer les statistiques.

Ces vues sont vouées à être utilisées dans les statistiques publiques (package `statistiques-publiques` dans ce repo) et dans les statistiques DGEC (Metabase RIE).

Elles permettent de simplifier les query des statistiques, de réutiliser des logiques de calcul afin de toujours appliquer la même logique (statut du projet, notion de raccordement "en service"...), et d'augmenter l'autonomie de l'administration sur Metabase.

## Mise à jour des vues

Le déploiement des vues n'est pas automatique. En cas de modification :

- re-créer la vue en local en exécutant le script du fichier concerné.
- mettre à jour le dump (pour utilisation locale et pour les remise à zéro des environnement de test)
- re-créer la vue sur chaque env (dev, staging, demo, production) en exécutant le script du fichier concerné.
