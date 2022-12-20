# Utiliser keycloak en local (pour tests)

⚠️ Le dossier `keycloak-legacy` est une copie legacy du repo [potentiel-keycloak](https://github.com/MTES-MCT/potentiel-keycloak) qui sert lui de production. Il doit toujours être au même niveau que celui de production ⚠️

## Lancer keycloak
****
Il est possible de lancer Keycloak en local via un conteneur Docker:

```bash
docker-compose --file=./keycloak-legacy/docker-compose.yml up -d
```

Il fait appel à [`Dockerfile.local`](../keycloak-legacy/Dockerfile.local) qui a la particularité de monter un volume pour les thèmes et de désactiver le cache. Ceci permet de travailler sur le fichier thème situés dans [`keycloak-legacy/themes`](../keycloak-legacy/themes) et voir immédiatement l'effet sur les écrans de l'instance keycloak.

NB: Sur MacOS M1, il est nécessaire de modifier le fichier [`Dockerfile.local`](../keycloak-legacy/Dockerfile.local) pour choisir l'image de base `wizzn/keycloak:12`, parce que celle de jboss crash.

### Accès à l'interface admin de keycloak

Il est possible d'accéder à l'interface admin de Keycloak via [http://localhost:8000/auth/admin/master/console/#/realms](http://localhost:8000/auth/admin/master/console/#/realms) puis en saisissant les identifiants présents dans le [`docker-compose.yml`](../keycloak-legacy/docker-compose.yml) (par défaut, admin/test).

### Création du Realm Potentiel

Au démarrage, seul le realm `master` est présent. Un realm (royaume en anglais) est une unité d'isolation: chaque realm comporte ses propres règles, utilisateurs, clients, ... Ca peut être intéressant pour partager la même instance keycloak pour plusieurs applications ou bien dans notre cas, pour plusieurs environnements isolés (prod/staging).

Il faut donc créer le realm Potentiel pour que notre application puisse se connecter dessus. Pour cela, dans le menu "Select Realm", choisir "Add Realm", puis dans "Import", sélectionner le fichier situé dans `keycloak-legacy/realm-export.json`. Le nom par défaut est `Potentiel` mais il est possible d'en changer (celui-ci devra être reporté dans la variable d'environnement `KEYCLOAK_REALM`).

Cet import aura déjà créé les clients et les rôles pour Potentiel. Il n'y aura pas d'utilisateurs en revanche.

### Configuration de l'application pour se connecter à Keycloak

#### Secrets dans variables d'environnement

Le realm Potentiel est donc disponible mais il faut encore configurer les clés secrètes des clients (interfaces par lesquelles notre application va se connecter sur Keycloak).
Pour cela, se rendre dans notre realm, puis dans la section "Clients".

Les deux clients qui vont nous intéresser sont `potentiel-admin-api` et `potentiel-web`.

Pour chacun de ces clients, l'ouvrir, se rendre dans l'onglet "Credentials" puis cliquer sur "Regenerate secret", copier le secret affiché dans la case et le rentrer dans la variable d'environnement `KEYCLOAK_USER_CLIENT_SECRET` pour `potentiel-web` ou `KEYCLOAK_ADMIN_CLIENT_SECRET` pour `potentiel-admin-api`.

#### Gérer le système d'authentification pour un environnement local

##### Si on ne souhaite pas activer le 2FA sur notre environnement local 
Lorsqu'on souhaite tester l'application en local, on n'a pas obligatoirement besoin de mettre en place une authentification à l'aide d'un double facteur. Pour se faire, il faut se rendre sur la page des [Flows](http://localhost:8000/auth/admin/master/console/#/realms/Potentiel/authentication/flows), faire une copie du flow de base `Browser` que l'on peut nommer `Simple auth`, et ensuite supprimer la ligne ` Conditional OTP`.

Une fois cette manipulation faite, bien penser à aller dans l'onglet [Bindings](Bindings(http://localhost:8000/auth/admin/master/console/#/realms/Potentiel/authentication/flow-bindings)) et choisir `simple auth` comme `Browser Flow`.


#### Branchement de l'application sur keycloak

La variable d'environnement `USE_FAKE_AUTH` permet d'utiliser une fausse brique d'authentification. Il suffit de supprimer cette variable ou bien de n'avoir aucune valeur afin d'utiliser l'instance Keycloak configurée.

Il faut s'assurer également qu'on a bien `KEYCLOAK_SERVER=http://localhost:8000/auth` dans les variables d'environnement.

Lancer l'application puis l'ouvrir. En cliquant sur "M'identifier", ça devrait rediriger sur une page d'authentification sur `localhost:8000/auth/...` qui est notre serveur keycloak local.

### Création d'utilisateurs pour tester

Pour tester, il est possible de se connecter à l'interface admin et de créer des utilisateurs à la main ("Users" => "Add User" => penser à cocher 'Email verified' pour activer l'utilisateur). Une fois que l'utilisateur est créé, se rendre dans l'onglet "Role mappings" pour lui donner le role désiré. L'onglet "Credentials" permet également de lui donner un mot de passe (décocher "temporary").

Pour activer la création de compte pour les nouveaux utilisateurs, il faut aller dans les "Realm Settings", onglet "Login" et activer "User registration". Un lien pour la création de nouveau compte apparaitra sur la page de login.

### Mise à jour des templates

Dans cette version locale, les thèmes Keycloak sont directement chargés à partir des fichiers dans le dossier `keycloak-legacy/themes`. Il est possible de les modifier en direct et de rafraichir la page pour voir le résultat.

## Test en local avec l'instance keycloak en prod

Il suffit de changer la variable d'environnements `KEYCLOAK_SERVER` pour prendre la valeur `https://auth.potentiel.beta.gouv.fr/auth` et mettre à jour `KEYCLOAK_REALM`, `KEYCLOAK_USER_CLIENT_SECRET` et `KEYCLOAK_ADMIN_CLIENT_SECRET` avec les valeurs qui se trouvent par exemple sur une instance de dev.

Il n'est pas possible de se connecter aux realms de staging ou production en local, vu que `localhost` ne fait pas partie des `Valid Redirect URIs` du client `potentiel-web`. Se brancher plutot sur `Potentiel-dev`.

## Créer un nouveau realm, clone du Potentiel

Il n'est pas possible d'importer plusieurs fois le fichier `realm-export.json` pour créer des clones puisque ce fichier contient des identifiants qui doivent être uniques.

Il est toutefois possible de créer un clone du fichier `realm-export.json` avec des identifiants neufs avec la commande suivante:

```bash
cd keycloak-legacy && node cloneRealm.js realm-export.json > realm-export2.json
```

Celui-ci pourra être importé pour faire un realm clone.

## Configuration de l'authentification à double facteur pour un role précis

Pour se faire il faut se rendre dans la partie `Authentification` du realm concerné.

### Créer un nouveau flow `Browser`

1. Dans l'onglet `Flows`
1. Faire une copie du flow `Browser` avec par exemple le nom `Browser with OTP for role`
1. Supprimer la partie `Browser - Conditional OTP`
1. Au niveau de l'étape `Browser with OTP for role`, supprimer l'exécution `Browser - Conditional OTP`
1. Ajouter une nouvelle exécution de type `Conditional OTP Form`
1. Modifer cette exécution pour être `REQUIRED`
1. Modifier la config de l'exécution :
   - Sélectionner le role voulu dans l'option `Force OTP for Role`
   - Sélectionner `skip` dans l'option `Fallback OTP handling`

### Affecter le flow Browser au flow nouvellement créé

1. Dans l'onglet `Bindings`
1. Sélectionner le flow `Browser with OTP for role` pour l'option `Browser Flow`
1. Sauvegarder

Désormais les utilisateurs avec le rôle spécifiés dans l'exécution `Browser - Conditional OTP` devront configurer une application comme FreeOTP ou Google Authenticator pour se connecter à Potentiel.
