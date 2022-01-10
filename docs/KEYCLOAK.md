# Authentification avec Keycloak

Keycloak est un service open source d'identité et de gestion d'accès.

Cette page a pour but d'expliquer la configuration et l'usage de keycloak dans le cadre de Potentiel.

Vous pouvez aussi lire la [documentation officielle de Keycloak](https://www.keycloak.org/documentation).

## Usage dans Potentiel

Une instance Keycloak est utilisée par Potentiel pour la gestion de l'authentification (login à partir d'email et mot de passe) et d'une partie de la gestion des autorisations (le rôle de chaque utilisateur).

Les autorisation plus fines (comme par exemple, les projets affectés à un utilisateur) sont gérés par le serveur d'application Potentiel lui-même (cf le domaine [`AuthZ`](../src/modules/authZ)).

Il ne concerne que les environnements `staging` et `production`. Dans les autres environnements, c'est un faux qui est utilisé pour simplifier (cf configuration dans [authN.config.ts](../src/config/authN.config.ts)).

## Mise en oeuvre

Keycloak tourne sur un serveur séparé. L'application peut le requêter pour les besoins d'authentification via le middleware `keycloak-connect` et la lib `keycloak-admin`. 

`keycloak-connect` vérifie la présence et la validité d'un token de session Keycloak. S'il est manquant ou invalide, l'utilisateur est redirigé vers la page d'authentification du serveur keycloak. Après identification, l'utilisateur est redirigé sur Potentiel avec le bon token de session.
Le token de session contient l'email de l'utilisateur ainsi que son role. L'email de l'utilisateur est utilisé pour retrouver l'identifiant interne de celui-ci. L'objet `Request` de express est enrichi avec un `User`. 

Ce mécanisme est mis en oeuvre via l'adaptateur [`makeKeycloakAuth`](../src/infra/keycloak/makeKeycloakAuth.ts).

La création d'un utilisateur peut être faite soit par inscription de l'utilisateur (qui se fait via des écrans gérés par le serveur Keycloak lui-même), soit par création de compte initié par l'application (invitation d'un utilisateur lors d'une désignation ou parrainage par un autre porteur de projet).
Dans ce dernier cas, l'application utilise `keycloak-admin` pour demander la création de l'utilisateur à Keycloak (cf [`createUserCredentials`](../src/infra/keycloak/createUserCredentials.ts))

Tous les mails d'authentification (invitation initiale, récupération de mot de passe) sont envoyés par Keycloak directement.

## Test en local: application locale et keycloak local

### Lancer keycloak

Il est possible de lancer Keycloak en local via un conteneur Docker:
```bash
docker-compose --file=./keycloak/docker-compose.yml up -d
```

Il fait appel à [`Dockerfile.local`](../keycloak/Dockerfile.local) qui a la particularité de monter un volume pour les thèmes et de désactiver le cache. Ceci permet de travailler sur le fichier thème situés dans [`keycloak/themes`](../keycloak/themes) et voir immédiatement l'effet sur les écrans de l'instance keycloak.  

NB: Sur MacOS M1, il est nécessaire de modifier le fichier [`Dockerfile.local`](../keycloak/Dockerfile.local) pour choisir l'image de base `wizzn/keycloak:12`, parce que celle de jboss crash.

### Accès à l'interface admin de keycloak

Il est possible d'accéder à l'interface admin de Keycloak via [http://localhost:8000/auth/admin/master/console/#/realms](http://localhost:8000/auth/admin/master/console/#/realms) puis en saisissant les identifiants présents dans le [`docker-compose.yml`](../keycloak/docker-compose.yml) (par défaut, admin/test).

### Création du Realm Potentiel

Au démarrage, seul le realm `master` est présent. Un realm (royaume en anglais) est une unité d'isolation: chaque realm comporte ses propres règles, utilisateurs, clients, ... Ca peut être intéressant pour partager la même instance keycloak pour plusieurs applications ou bien dans notre cas, pour plusieurs environnements isolés (prod/staging). 

Il faut donc créer le realm Potentiel pour que notre application puisse se connecter dessus. Pour cela, dans le menu "Select Realm", choisir "Add Realm", puis dans "Import", sélectionner le fichier situé dans `keycloak/realm-export.json`. Le nom par défaut est `Potentiel` mais il est possible d'en changer (celui-ci devra être reporté dans la variable d'environnement `KEYCLOAK_REALM`).

Cet import aura déjà créé les clients et les rôles pour Potentiel. Il n'y aura pas d'utilisateurs en revanche.

### Configuration de l'application pour se connecter à Keycloak

#### Secrets dans variables d'environnement 

Le realm Potentiel est donc disponible mais il faut encore configurer les clés secrètes des clients (interfaces par lesquelles notre application va se connecter sur Keycloak).
Pour cela, se rendre dans notre realm, puis dans la section "Clients".  

Les deux clients qui vont nous intéresser sont `potentiel-admin-api`  et `potentiel-web`.  

Pour chacun de ces clients, l'ouvrir, se rendre dans l'onglet "Credentials" puis cliquer sur "Regenerate secret", copier le secret affiché dans la case et le rentrer dans la variable d'environnement `KEYCLOAK_USER_CLIENT_SECRET` pour `potentiel-web` ou `KEYCLOAK_ADMIN_CLIENT_SECRET` pour `potentiel-admin-api`.

#### Branchement de l'application sur keycloak

En local, la configuration par défaut ne se branche pas sur keycloak mais sur un faux auth. Pour changer cela, il faut se rendre dans [authN.config.ts](../src/config/authN.config.ts) et changer `if (isProdEnv || isStagingEnv) {` par `if (true) {` (NB: ce n'est pas idéal comme façon de faire mais c'est un cas d'usage rare. Pour la suite, on pourra imaginer passer par une variable d'environnement pour choisir le type d'authentification.).

Il faut s'assurer également qu'on a bien `KEYCLOAK_SERVER=http://localhost:8000/auth` dans les variables d'environnement.

Lancer l'application puis l'ouvrir. En cliquant sur "M'identifier", ça devrait rediriger sur une page d'authentification sur `localhost:8000/auth/...` qui est notre serveur keycloak local.

### Création d'utilisateurs pour tester

Pour tester, il est possible de se connecter à l'interface admin et de créer des utilisateurs à la main ("Users" => "Add User" => penser à cocher 'Email verified' pour activer l'utilisateur). Une fois que l'utilisateur est créé, se rendre dans l'onglet "Role mappings" pour lui donner le role désiré. L'onglet "Credentials" permet également de lui donner un mot de passe (décocher "temporary").

Pour activer la création de compte pour les nouveaux utilisateurs, il faut aller dans les "Realm Settings", onglet "Login" et activer "User registration". Un lien pour la création de nouveau compte apparaitra sur la page de login.


### Mise à jour des templates

Dans cette version locale, les thèmes Keycloak sont directement chargés à partir des fichiers dans le dossier `keycloak/themes`. Il est possible de les modifier en direct et de rafraichir la page pour voir le résultat.

## Test en local avec l'instance keycloak en prod

Il suffit de changer la variable d'environnements `KEYCLOAK_SERVER` pour prendre la valeur `https://auth.potentiel.beta.gouv.fr/auth` et mettre à jour `KEYCLOAK_REALM`, `KEYCLOAK_USER_CLIENT_SECRET` et `KEYCLOAK_ADMIN_CLIENT_SECRET` avec les valeurs qui se trouvent par exemple sur une instance de dev.

Il n'est pas possible de se connecter aux realms de staging ou production en local, vu que `localhost` ne fait pas partie des  `Valid Redirect URIs` du client `potentiel-web`. Se brancher plutot sur `Potentiel-dev`.

## Créer un nouveau realm, clone du Potentiel

Il n'est pas possible d'importer plusieurs fois le fichier `realm-export.json` pour créer des clones puisque ce fichier contient des identifiants qui doivent être uniques.

Il est toutefois possible de créer un clone du fichier `realm-export.json` avec des identifiants neufs avec la commande suivante:
```bash
cd keycloak && node cloneRealm.js realm-export.json > realm-export2.json
```

Celui-ci pourra être importé pour faire un realm clone.

## Déployer keycloak en production

Keycloak est déployé comme une application Docker sur Clever Cloud. Son déploiement est manuel:
```bash
clever deploy -a keycloak-vanilla --force
```

C'est la variable d'environnement `CC_DOCKERFILE` qui pointe sur `keycloak/Dockerfile` (coté clever cloud, pas en local) et permet de bien déployer la bonne partie du repo.

