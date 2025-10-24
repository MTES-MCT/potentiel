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
    - [Les tests de specifications (scénarios métiers)](#les-tests-de-specifications-scénarios-métiers)
    - [Les tests unitaires](#les-tests-unitaires)
  - [Metabase local](#metabase-local)
    - [Générer et consulter les données de statistique publique](#générer-et-consulter-les-données-de-statistique-publique)
    - [Mettre son metabase local en mode DGEC](#mettre-son-metabase-local-en-mode-dgec)
  - [Restaurer un dump de la base de donnée](#restaurer-un-dump-de-la-base-de-donnée)
  - [Lancer des commandes CLI](#lancer-des-commandes-cli)
  - [Tâches récurrentes / CRON](#tâches-récurrentes--cron)
    - [Monitoring des tâches récurrentes](#monitoring-des-tâches-récurrentes)

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

4. Configurer les variables d'environnement à la base des applications :

   ```bash
   cp packages/applications/ssr/.env.template packages/applications/ssr/.env
   cp packages/applications/subscribers/.env.template packages/applications/subscribers/.env
   cp packages/applications/legacy/.env.template packages/applications/legacy/.env
   ```

5. Synchroniser les submodules

   Il faut retourner à la racine du repo et exécuter :

   ```bash
      git submodule init
      git submodule update
   ```

## <a id="keycloak"></a>Système d'authentification avec Keycloak

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

L'application est composée de 3 parties :

- le serveur web dit "ssr", qui contient les pages migrées en Next.js
- le serveur web dit "legacy", qui contient la page projet et englobe la partie "ssr"
- le serveur "worker" qui exécute les tâches de fond (projections, sagas et notifications)

Ces composants peuvent être lancés individuellement ou de manière simultanée.

1. Lancer l'application via le script npm :

```bash
npm run build
npm run start
```

2. Se rendre sur [localhost:3000](http://localhost:3000)

3. Se connecter à l'un des comptes suivants (mot de passe pour tous les comptes : **test**) :
   - admin@test.test
   - dreal@test.test (Ile-de-France)
   - porteur@test.test
   - ademe@test.test
   - ao@test.test
   - cocontractant@test.test (Métropole)
   - cocontractant+zni@test.test (ZNI)
   - cocontractant+mayotte@test.test (Mayotte)
   - dgec-validateur@test.test
   - cre@test.test
   - caissedesdepots@test.test
   - grd@test.test (Enedis)

> ℹ️ Il est possible de couper les services utilisés localement pour lancer l'application via le script npm **`stop:dev`**

## <a id="avoir-des-donnees-de-test-en-local">Avoir des données de test en local</a>

### <a id="le-seed-automatique">Le seed automatique</a>

Lorsque la comande `start:dev` est lancée, elle va automatiquement démarrer les containers docker. Le container dédié à la base de donnée va alors mapper le fichier [potentiel-dev.dump](../../.database/potentiel-dev.dump) dans le container, et va ajouter le script [restore-dev-db.sh](../../.database/scripts/restore-dev-db.sh) pour qu'il s'éxécute lors de l'initialisation de la base de donnée. Ce script restore le contenu du dump dans la base de donnée.

> ✨ Si vous avez besoin de compléter le dump qui est seed par défaut, vous pouvez effectuer les modifications sur la base de donnée avec votre éditeur de base de donnés.
>
> Une fois les modifications effectives, vous n'avez plus qu'à faire un dump de votre base de donnée, via la commande `npm update:dump`.
>
> Attention ! Pensez à ne garder que les modifications pertinentes. Vous pouvez remettre la base de donnée à son état d'origine avec `npm run down && npm run up`.

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

Il existe plusieurs type de test dans le projet :

### <a id="specs">Les tests de specifications (scénarios métiers)</a>

1. Pour lancer touts les tests, vous pouvez utiliser le script npm `specs` :
   ```shell
   npm run specs
   ```
2. Il est possible de cibler des tests par domaine / fonctionnalité en rajoutant dans les fichiers `*.feature` des alias en haut de fichier (par exemple `@demander-délai`)

```bash
npm run specs -- -t @délai
npm run specs -- -t @demander-délai
```

1. Il est possible de cibler des tests spécifique grâce au tag `@select`. Exemple :

```gherkin
@select
Scénario: Ajouter un gestionnaire de réseau
```

Utilisez ensuite le script `npm run specs:select`

```shell
npm run specs:select
```

### <a id="unit">Les tests unitaires</a>

1. Lancer tout les tests unitaires des packages librairies et applications

```bash
npm run test:apps
npm run test:libraries

```

2. Cibler un fichier de test unitaire spécifique

Se rendre dans le répertoire où le test cible se situe et exécuter :

```bash
npx tsx --test path/to/file.test.ts

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
