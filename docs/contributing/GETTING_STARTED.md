# Premiers pas dans le projet Potentiel

## Table des matières

- [Premiers pas dans le projet Potentiel](#premiers-pas-dans-le-projet-potentiel)
  - [Table des matières](#table-des-matières)
  - [Mise en place du projet](#mise-en-place-du-projet)
  - [Configurer un environnement local](#configurer-un-environnement-local)
  - [Système d'authentification avec Keycloak](#système-dauthentification-avec-keycloak)
  - [Lancer l'application en local](#lancer-lapplication-en-local)
  - [Avoir des données de test en local](#avoir-des-données-de-test-en-local)
    - [Le seed automatique](#le-seed-automatique)
    - [Ajouter "à la main des projets dans Potentiel"](#ajouter-à-la-main-des-projets-dans-potentiel)
  - [Lancer les tests](#lancer-les-tests)
    - [Specifications](#specifications)
  - [Metabase local](#metabase-local)
    - [Générer et consulter les données de statistique publique](#générer-et-consulter-les-données-de-statistique-publique)
    - [Mettre son metabase local en mode DGEC](#mettre-son-metabase-local-en-mode-dgec)
  - [Restaurer un dump de la base de donnée](#restaurer-un-dump-de-la-base-de-donnée)
  - [Lancer des commandes CLI](#lancer-des-commandes-cli)

## <a id="mise-en-place-du-projet">Mise en place du projet</a>

Pour installer et lancer le projet vous aurez besoin de :

- <a href="https://github.com/nvm-sh/nvm#installing-and-updating" target="_blank">NVM</a>
- <a href="https://docs.docker.com/get-docker/" target="_blank">Docker</a>

## <a id="configurer-un-environnement-local">Configurer un environnement local</a>

1. Cloner le repository

   ```bash
   git clone https://github.com/MTES-MCT/potentiel.git
   cd potentiel
   ```

2. Installer Node.js via la commande **nvm** à la racine du projet (**nvm** utilisera la configuration contenue dans le fichier **[.nvmrc](/.nvmrc)**) :

   ```bash
   nvm install
   ```

3. Installer les dépendances :

   ```bash
   npm install
   ```

4. Pour contribuer, installer le package **[gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli)** :

   ```bash
   npm i -g gitmoji-cli
   ```

5. Installer le commit hook de Gitmoji :

   ```bash
   gitmoji -i
   ```

6. Configurer Gitmoji pour l'utilisation des Emojis (♻️) plutôt que des Emoji codes (`:recycle:`) :

   ```bash
   gitmoji -g
   ```

7. Configurer les variables d'environnement à la base des deux applications (ssr et legacy) :

   ```bash
   cd packages/applications/ssr
   cp .env.template .env
   cd ../legacy
   cp .env.template .env
   ```

8. Synchroniser les submodules

   Il faut retourner à la racine du repo et exécuter :

   ```bash
      git submodule init
      git submodule update
   ```

## <a id="keycloak">Système d'authentification avec Keycloak

</a> 
Nous utilisons le service de Keycloak seulement en local.

Keycloak est un service open source d'identité et de gestion d'accès. Pour comprendre comment ce service est mis en oeuvre, vous pouvez trouver la documentation sur le [repo dédié au thème](https://github.com/MTES-MCT/potentiel-keycloak#mise-en-oeuvre).

En local, lorsque la commande `npm run up` (ou `docker compose up -d`) est lancée, un container `auth` va se monter avec l'[image officielle de Keycloak](https://quay.io/repository/keycloak/keycloak). Nous avons créé un thème custom visible dans [ce repo](https://github.com/MTES-MCT/potentiel-keycloak).

> ⚠️ Si l'affichage ne prend pas en compte le thème `dsfr`, n'hésitez pas à suivre ces étapes:
>
> 1. Suppression du répertoire submodule si il existe : `rm -Rf keycloak/potentiel-keycloak`
> 2. Mise à jour du submodule : `git submodule update`

Lors du montage de l'image, le fichier [realm-dev.json](./keycloak/import/realm-dev.json) est importé et va configurer le royaume keycloak pour l'environnement de dev, et y ajouter des utilisateurs de tests.

Pour les environnements de production et de staging, Keycloak est hébergé sur une application scalingo et utilise le [repo du thème custom](https://github.com/MTES-MCT/potentiel-keycloak).

## <a id="lancer-application-en-local">Lancer l'application en local</a>

> ⚠️ Pour démarrer l'application vous aurez besoin de Docker 🐋

1. Lancer l'application via le script npm :

```bash
npm run dev
```

Pour accéder à toute l'application, y compris les quelques pages encore gérées dans l'application legacy :

```bash
npm run start:legacy
```

Pour compiler puis lancer l'application comme cela est fait en production :

```bash
npm run build
npm run start
```

2. Se rendre sur [localhost:3000](http://localhost:3000)

3. Se connecter à l'un des comptes suivants (mot de passe pour tous les comptes : **test**) :
   - admin@test.test
   - dreal@test.test
   - porteur@test.test
   - ademe@test.test
   - ao@test.test
   - dgec-validateur@test.test
   - cre@test.test
   - caissedesdepots@test.test
   - grd@test.test

> ℹ️ Il est possible de couper les services utilisés localement pour lancer l'application via le script npm **`stop:dev`**

## <a id="avoir-des-donnees-de-test-en-local">Avoir des données de test en local</a>

### <a id="le-seed-automatique">Le seed automatique</a>

Lorsque la comande `start:dev` est lancée, elle va automatiquement démarrer les containers docker. Le container dédié à la base de donnée va alors mapper le fichier [potentiel-dev.dump](../../.database/potentiel-dev.dump) dans le container, et va ajouter le script [restore-dev-db.sh](../../.database/scripts/restore-dev-db.sh) pour qu'il s'éxécute lors de l'initialisation de la base de donnée. Ce script restore le contenu du dump dans la base de donnée.

> ✨ Si vous avez besoin de compléter le dump qui est seed par défaut, vous pouvez effectuer les modifications sur la base de donnée avec votre éditeur de base de donnés.
>
> Une fois les modifications effectives, vous n'avez plus qu'à faire un dump de votre base de donnée. Pour se faire il lancer le script npm 'update:dump'
>
> Il ne vous reste qu'à remplacer votre fichier à jour avec celui existant

### <a id="ajouter-a-la-main-projets-dans-potentiel">Ajouter "à la main des projets dans Potentiel"</a>

Afin de pouvoir tester le fonctionnement de la partie désignation et notification des candidats d'une période d'appel d'offre, vous avez la possibilité d'ajouter "à la main" des projets dans Potentiel. Pour celà :

1. [Lancer l'application en local](#lancer-application-en-local)

2. Récupérer les fichiers présents dans `.demo`

3. Se connecter au compte test **dgec-validateur@test.test** (mot de passe `test`)

4. Dans l'interface

- Importer un fichier

Se rendre dans l'onglet Imports >> Nouveaux Candidats >> Choisir un fichier (un des fichiers de `.demo`) >> Envoyer.

- Valider les candidats

Se rendre dans l'onglet Désignation >> Notifier les Candidats >> Notifier tous les candidats de la période.

- Se connecter à n'importe quel compte de test en fonction des besoins

## <a id="lancer-les-tests">Lancer les tests</a>

### <a id="specs">Specifications</a>

Il existe deux types de test dans le projet, les tests dit **`legacy`** (couvrant l'ancien socle technique de manière disparate) et les tests dits de **`specification`** liés au nouveau socle mise en place en Behavior Driven Development.

1. Pour lancer les tests **`legacy`**, vous pouvez utiliser le script npm **`test:legacy`** :

   ```shell
   npm run test:legacy
   ```

2. Lancer tous les tests **`legacy`**, en relançant à chaque changement

```shell
npm run test:legacy -- --watch
```

3. Lancer un seul test **`legacy`**, en relançant à chaque changement

```shell
npm run test:legacy -- --watch src/modules/AppelOffre.spec.ts
```

4. Pour lancer les tests de **`specifications`**, vous pouvez utiliser le script npm `specs` :
   ```shell
   npm run specs
   ```
5. Il est possible de lancer les tests de **`specifications`** uniquement sur certains scénarios. Pour ce faire, ajoutez un tag **`@select`** sur les scénarios que vous voulez lancer. Exemple :

```gherkin
@select
Scénario: Ajouter un gestionnaire de réseau
   Quand un administrateur ajoute un gestionnaire de réseau
      | Code EIC             | 17X0000009352859       |
      | Raison sociale       | Arc Energies Maurienne |
      | Format               | XXX                    |
      | Légende              | Trois lettres          |
      | Expression régulière | [a-zA-Z]{3}            |
   Alors le gestionnaire de réseau "Arc Energies Maurienne" devrait être disponible dans le référenciel des gestionnaires de réseau
   Et les détails du gestionnaire de réseau "Arc Energies Maurienne" devraient être consultables
```

Utilisez ensuite le script npm **`specs:select`** :

```shell
npm run specs:select
```

6. Lancer les tests sur un domaine en particulier (ex : candidature)

```shell
npm run specs -- -t @[tag-associé-au-domaine]
```

exemple :

```shell
npm run specs -- -t @candidature
```

## <a id="metabase">Metabase local</a>

Nous utilisons [Metabase](https://www.metabase.com/) pour faire afficher les [statistiques publiques](https://potentiel.beta.gouv.fr/stats.html) de Potentiel.

#### Générer et consulter les données de statistique publique

Un container docker local est disponible pour vérifier et générer des dashboard à partir des données de db local, sur le schéma `domain_public_statistic` lisible en **read-only**.

1. Générer les statistiques publiques

- définir la variable `export DATABASE_CONNECTION_STRING=` (cf [.env.template](../../packages/applications/ssr/.env.template))
- Lancer la commande depuis la racine du repo `npm exec potentiel-cli stats extraire`

2. Consulter les statistiques publiques

Le container est monté lorsque la commande `up` est lancé (cf [scripts npm](./DEVELOPMENT_FLOW.md#scripts-npm)), et est disponible sur [cet url](http://localhost:3615).
Pour se connecter à l'interface, il faut utiliser les credentials suivant :

- identifiant : `admin@test.test`
- password: `test`

#### Mettre son metabase local en mode DGEC

Il est possible d'avoir un metabase local qui reprend le contenu du metabase DGEC interne au ministère.
Pour faire cela, merci de vous référer à la [documentation sécurisée](https://collab.din.developpement-durable.gouv.fr/sites/dgec-team-potentiel/Documents%20partages/60-Tech/Metabase%20public)

## <a id="restaurer-dump-db">Restaurer un dump de la base de donnée</a>

- Pour cette partie il vaut mieux préférer la méthode "one-off-container" en téléchargeant le dump directement sur les serveurs Scalingo.

`scalingo --app [nom-de-l-application] run --file ./potentiel.dump bash`

- Il faut ensuite installer les outils postgres.

`dbclient-fetcher psql`

- Enfin restaurer le dump téléchargé sur le container dans le répertoire /tmp/upload.

`pg_restore --clean --if-exists --no-owner --no-privileges --no-comments --dbname $DATABASE_URL /tmp/uploads/potentiel.dump`

## Lancer des commandes CLI

Des commandes d'administration du produit sont disponible via ligne de commande.
L'utilisation de cette CLI peut se faire en executant `potentiel-cli` dans le repository ou depuis un conteneur en production.

`potentiel-cli --help` permet d'obtenir la liste des commandes disponibles et les instructions d'utilisation.

Le code correspondant à cette CLI se trouve dans [./packages/applications/cli](./packages/applications/cli), et peut également être exécuté via `./packages/applications/cli/bin/run.js` ou `./packages/applications/cli/bin/dev.js` si besoin.

La CLI utilise le framework [oclif](https://oclif.io/); la structure des dossiers determine la structure des commandes (eg. `./src/commands/files/copy` correspond à la commande `potentiel-cli files copy` ).

Le comportement des commandes est guidé grâce aux [hooks](https://oclif.io/docs/hooks/), défini dans le [package.json](/packages/applications/cli/package.json) :

- à l'initialisation, les variables d'environnement sont parsées et le logger est configuré
- avant l'éxecution de la commande, et en présence d'une variable statique `monitoringSlug`, le démarrage de la commande est notifié à Sentry.
- après l'éxecution, et en présence d'une variable statique `monitoringSlug`, la connection à la DB est coupée et Sentry est notifié du succès ou de l'échec de la commande.

## Tâches récurrentes / CRON

Les tâches récurrentes sont définies dans le fichier [cron.json](/cron.json).

La CLI mentionnée ci dessus est utilisée pour la majorité des tâches récurrentes, à l'exception des backups.

### Monitoring des tâches récurrentes

Le succès de ces tâches récurrentes est monitorée via Sentry et sa fonctionalité "Cron Monitors".

Pour activer cette option dans une tâche récurrente executée avec la CLI, il suffit de spécifier un champ statique `monitoringSlug` avec le slug du monitor dans la commande.
