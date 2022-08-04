# Déploiement manuel sur l'instance Staging

Pour déployer depuis une machine locale il faut utiliser la cli scalingo avec une connexion sécurisée SSH.

## Connexion SSH avec Scalingo

https://doc.scalingo.com/platform/getting-started/first-steps

## Instalation de la cli

https://doc.scalingo.com/cli

## Configuration du dépots git de l'instance Scalingo

Ajouter le dépôt de l'application scalingo

`git remote add staging git@ssh.[region].scalingo.com:[nom-de-l-application].git`

L'url de la remote est disponible dans la partie 'Deploy/Configuration' du dashboard de l'application

## Pousser une branche en cours de développement sur staging

Il suffit d'exécuter la commande git suivante

`git push staging [ma-branche-en-cours-de-dev]:master`

# Restaurer un dump de la base de donnée

- Pour cette partie il vaut mieux préférer la méthode "one-off-container" en téléchargeant le dump directement sur les serveurs Scalingo.

`scalingo --app [nom-de-l-application] run --file ./potentiel.dump bash`

- Il faut ensuite installer les outils postgres.

`dbclient-fetcher psql`

- Enfin restaurer le dump téléchargé sur le container dans le répertoire /tmp/upload.

`pg_restore --clean --if-exists --no-owner --no-privileges --no-comments --dbname $DATABASE_URL /tmp/uploads/potentiel.dump`
