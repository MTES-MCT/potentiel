# Suivi des Projets d'Energies Renouvelables

## Introduction

L’Etat français met en œuvre une politique volontariste de soutien au développement des énergies renouvelables (EnR) électriques. L’objectif est d’atteindre une part de 40% de ces énergies sur le total de l’électricité produite à l’horizon 2030. Chaque année, environ 1500 projets d’EnR électrique sont d’ores et déjà désignés lauréats d’un appel d’offres pour la production d’électricité renouvelable.

Potentiel permet de faciliter la gestion de ces projets, de gagner en traçabilité et en efficacité en fluidifiant les échanges entre porteurs de projets et administration (centrale et déconcentrée) et, à terme entre les divers opérateurs (acheteurs, gestionnaires de réseau, organismes de contrôle).

Le site est accessible sur [potentiel.beta.gouv.fr](https://potentiel.beta.gouv.fr).
Vous pouvez également consulter [les statistiques d'usage](https://potentiel.beta.gouv.fr/stats.html).

N'hésitez pas à regarder également la [fiche betagouv](https://beta.gouv.fr/startups/potentiel.html) du projet.

La suite de ce document explique comment lancer l'application sur sa machine et la déployer.

## Autre ressources

- [Guide d'utilisation](https://docs.potentiel.beta.gouv.fr)
- [Documentation de l'architecture](./docs/ARCHITECTURE.md)
  - [Listing des événements](./docs/EVENTS.md)
  - [Listing des projections](./docs/PROJECTIONS.md)
- [Les grandes 'recettes' pour le développeur](./docs/RECIPES.md)
- [L'authentification avec Keycloak](./docs/KEYCLOAK.md)
- [L'analyse de données avec Metabase](./docs/METABASE.md)
- [Optimisation d'un bundle js front](./docs/BUNDLE_FRONT.md)

## Sommaire

- [Suivi des Projets d'Energies Renouvelables](#suivi-des-projets-denergies-renouvelables)
  - [Introduction](#introduction)
  - [Autre ressources](#autre-ressources)
  - [Sommaire](#sommaire)
- [Développement en local](#développement-en-local)
  - [Mise en place initiale](#mise-en-place-initiale)
    - [Pré-requis](#pré-requis)
    - [Installation](#installation)
  - [Lancement de l'application locale](#lancement-de-lapplication-locale)
    - [Import initial de projets dans la base de données locale](#import-initial-de-projets-dans-la-base-de-données-locale)
      - [Importer les projets](#importer-les-projets)
      - [Voir les projets sur l'interface](#voir-les-projets-sur-linterface)
    - [Accès à la base de données locale](#accès-à-la-base-de-données-locale)
    - [Produire un dump de la base de données locale](#produire-un-dump-de-la-base-de-données-locale)
    - [Restaurer un dump de la base de données locale](#restaurer-un-dump-de-la-base-de-données-locale)
    - [Avoir un aperçu des pages ou composants visuels avec Storybook](#avoir-un-aperçu-des-pages-ou-composants-visuels-avec-storybook)
  - [Lancer les tests automatisés](#lancer-les-tests-automatisés)
  - [Keycloak](#keycloak)
- [Environnements et Déploiement](#environnements-et-déploiement)
  - [Les environnements](#les-environnements)
    - [Local](#local)
    - [Demo](#demo)
    - [Staging](#staging)
    - [Production](#production)
  - [Déploiement](#déploiement)
    - [Déployer sur Production](#déployer-sur-production)
  - [Déployer sur Staging / Démo](#déployer-sur-staging--démo)
    - [Déploiement](#déploiement-1)

# Développement en local

[Ouvrir dans conteneur Gitpod](https://gitpod.io/#https://github.com/MTES-MCT/potentiel)

## Mise en place initiale

### Pré-requis

- <a href="https://nodejs.org/en/" target="_blank">Node</a> v14 ou plus
- <a href="https://docs.npmjs.com/downloading-and-installing-node-js-and-npm" target="_blank">NPM</a> v7 ou plus
- <a href="https://docs.docker.com/get-docker/" target="_blank">Docker</a>

### Installation

1.  Dupliquer le fichier `.env.template` et le renommer en `.env` (les valeurs par défaut doivent suffire pour le travail local)

2.  Installer les dépendances

    ```
    npm install
    ```

3.  Pour contribuer: installer `commitizen` en global pour formatter les messages de commit

    ```
    npm i -g commitizen
    ```

    Par la suite, utiliser la commande `git cz` à la place de `git commit`

## Lancement de l'application locale

1. Lancer une base de données locale (lance un conteneur docker)

   ```shell
   npm run dev-db
   ```

2. Lancer la migration de données (création des tables et insertion des utilisateurs de test)

   ```shell
   # Créer les tables (à relancer à chaque nouvelle migration de schéma)
   npm run migrate

   # Insérer les utilisateurs test
   npm run seed
   ```

3. Lancer le serveur en mode "watch" (redémarrage à chaque changement de fichier)

   ```shell
   npm run watch
   ```

4. Se rendre sur [localhost:3000](http://localhost:3000)
5. Se connecter un des comptes suivants (mot de passe: test):

- admin@test.test
- dreal@test.test
- porteur@test.test

### Import initial de projets dans la base de données locale

#### Importer les projets

Afin de pouvoir ajouter des projets à la base de données fraichement créée, il va falloir importer ces projets depuis l'interface Potentiel.

Une fois connecté en tant qu'administrateur (admin@test.test), aller sur la page <a href="http://localhost:3000/admin/importer-candidats.html" target="_blank">"Importer des candidats"</a> et ajouter <a href="https://raw.githubusercontent.com/MTES-MCT/potentiel/master/docs/exempleCandidatsPPE2.csv">ce fichier</a>.

#### Voir les projets sur l'interface

Une fois l'import fait, il faut notifier les candidats afin que leurs projets puissent apparaîtrent sur l'interface. Pour celà, il faut se rendre sur la page <a href="http://localhost:3000/admin/notifier-candidats.html" target="_blank">"Notifier des candidats"</a> et cliquer sur le bouton "Envoyer la notification". Pour qu'un projet apparaisse sur l'interface, il faut que celui-ci ait un statut **Classé**. Vous pouvez répéter la notification plusieurs fois pour avoir une base suffisante de projets.

### Accès à la base de données locale

Vous pouvez utiliser une UI telle que [`pgAdmin`](https://www.pgadmin.org) pour accéder à la base de données ou la ligne de commande.

Voici les instructions pour la ligne de commande:

_NB: Nécessite d'installer `psql` et `dotenv` (`npm install -g dotenv-cli`) sur sa machine._

Pour la base de données de dev (celle créée par `npm run dev-db`), les credentials sont présents dans le fichier `.env`. Celui-ci peut donc être utilisé pour injecter ces valeurs dans la commande `psql`, de la façon suivante:

```
dotenv -- bash -c 'psql -h $POSTGRESQL_ADDON_HOST -p $POSTGRESQL_ADDON_PORT -U $POSTGRESQL_ADDON_USER -d $POSTGRESQL_ADDON_DB'
# Le mot de passe est localpwd
```

Pour la base de données de test (celle créée par `npm run test-db`), les credentials sont présents dans le fichier [sequelize.config.js](src/sequelize.config.js) mais ne changent pas, en général.

```
psql -h localhost -p 5433 -d potentiel_test -U testuser -W
# Le mot de passe est vide
```

### Produire un dump de la base de données locale

Peut être intéressant pour produire un état de la base qui est rapidement reproductible.

```
dotenv -- bash -c 'pg_dump -h $POSTGRESQL_ADDON_HOST -p $POSTGRESQL_ADDON_PORT -U $POSTGRESQL_ADDON_USER -d $POSTGRESQL_ADDON_DB --format=c -f database.dump'
```

### Restaurer un dump de la base de données locale

Peut être intéressant pour charger un dump de la base de prod en locale, pour débugger.

```
dotenv -- bash -c 'pg_restore -h $POSTGRESQL_ADDON_HOST -p $POSTGRESQL_ADDON_PORT -U $POSTGRESQL_ADDON_USER -d $POSTGRESQL_ADDON_DB --format=c database.dump'
```

_NB: Si le dump contient un schéma de données qui est en retard avec l'application dans son état actuel, il faut jouer le script de migration: `npm run migrate`._

### Avoir un aperçu des pages ou composants visuels avec Storybook

[Storybook](https://storybook.js.org) est un service qui permet d'afficher un catalogue des pages ou des composants React sans avoir à lancer de serveur backend.
Pour le rendu, des données fictives sont injectées en tant que props de nos composants.

Pour lancer storybook:

```bash
npm run storybook

# Si c'est le premier lancement de l'application, il faut aussi construire le fichier css de l'application
npm run build:css
```

En cas de modification de la vue, storybook rafraichit automatiquement le rendu, ce qui permet d'avoir une boucle de travail fluide.

Pour ajouter un composant au storybook ou bien modifier les données fictives injectées, il faut créer/éditer un fichier `.stories.tsx` dans le même dossier que le composant (se référer à un fichier existant pour le format).

Storybook est configuré pour inclure tous les fichiers avec ce suffixe dans le dossier `src/views` (cf config dans `.storybook/main.js`).

## Lancer les tests automatisés

1. Préparer une base de données de test (lance un conteneur docker)

   ```shell
   npm run test-db
   ```

   _NB: Ceci est uniquement nécessaire pour les tests d'intégration et les tests end-to-end._

2. Lancer les tests unitaires

   ```shell
   # Tous, une fois
   npm run test

   # Tous, en relançant à chaque changement
   npm run test -- --watch

   # Un seul test, en relançant à chaque changement
   npm run test -- --watch src/modules/AppelOffre.spec.ts
   ```

3. Lancer les tests d'intégration

   ```shell
   # Tous, une fois
   npm run test-int

   # Tous, en relançant à chaque changement
   npm run test-int -- --watch

   # Un seul test, en relançant à chaque changement
   npm run test-int -- --watch src/modules/AppelOffre.spec.ts
   ```

   _NB: Si le schéma de base de données a changé, il faut relancer `npm run test-db`._

## Keycloak

L'authentification de Potentiel se fait via un service autonome, sous la forme d'une instance [Keycloak](https://www.keycloak.org). Cette instance est déployée sur Clever Cloud et est partagée entre les environnements de `staging` et `production`.

Dans les autres environnements (ex: `development`), l'authentification est géré par un servie `fakeAuth`. Il n'est donc pas nécessaire d'avoir une instance keycloak en local ou en démo.

Une documentation plus poussée de keycloak est disponible dans [`docs/KEYCLOAK.md`](/docs/KEYCLOAK.md).

# Environnements et Déploiement

## Les environnements 

### Local 

Cet environnement est réservé à chaque développeur travaillant sur le projet. 
Il permet de faire les développements sur un environnement sans risque d'altérer la donnée.
La base de donnée de cet environnement est falsifié, afin d'éviter l'accès à des vrais données projets en cas de perte / vol de l'ordinateur. À noter qu'en tant qu' e présenter des vrais données projets.
Il dispose d'un système de connexion simplifié qui ne nécessite pas de renseigner de mot de passe mais uniquement une adresse email d'un compte utilisateur pour se connecter avec son compte. cf 
Pour installer et utiliser cet environnement, il faut suivre cette [documentation](#développement-en-local).

### [Demo](https://demo.potentiel.incubateur.net/) 

Cet environnement est dédié à la démonstration de l'outil, que ce soit à des fins commerciales ou démonstratives. 
La base de donnée de cet environnement est falsifié, afin d'éviter de présenter des vrais données projets.
Il dispose d'un système de connexion simplifié qui ne nécessite pas de renseigner de mot de passe mais uniquement une adresse email d'un compte utilisateur pour se connecter avec son compte. Les comptes tests permettent un accès rapide en tant qu'un certain type d'utilisateur, ils sont disponible [ici](#lancement-de-lapplication-locale)

### [Staging](https://staging.potentiel.incubateur.net/)

Cet environnement est une copie de la production. Il sert essentiellement à faire des tests. La base de donnée de cet environnement est une copie de celle de production.
Afin de pouvoir se connecter sur cet environnement, il est nécessaire que vous ayez un compte. Pour obtenir celà, il faudra passer par la console de Keycloak (cf [documentation](#keycloak)).

### [Production](https://potentiel.beta.gouv.fr/)

Cet environnement est celui utilisé par nos utilisateurs. 
Afin de pouvoir se connecter sur cet environnement, il est nécessaire que vous ayez un compte. Pour obtenir celà, il faudra passer par la console de Keycloak (cf [documentation](#keycloak)).


## Déploiement


Les différents environnements sur lesquels l'application est hébergée sont en cours de migration de [Clever Cloud](https://www.clever-cloud.com) vers [Scalingo](https://scalingo.com/fr). Tout deux sont des [PaaS](https://fr.wikipedia.org/wiki/Platform_as_a_service)

### Déployer sur Production

L'environnement de production est encore hébergé sur Clever Cloud. Le déploiement se fait de manière autoamtisée à chaque push de la branche `master`, grace à l'execution d'une [Github Action](.github/workflows/deploy.prod.yml). Il s'agit d'une branche protégée. Il faut donc obligatoirement passer par une PR pour y contribuer.

## Déployer sur Staging / Démo

Ces deux environnements sont hébergés sur Scalingo. [Voici la démarche à suivre pour faire un déploiement manuel](docs/DEPLOY.md)

<!--nstallation des clever-tools

```
npm install -g clever-tools
clever login
```

_NB: il faut avoir créé un compte sur clever cloud et avoir les droits d'accès à l'orga._

### Déploiement

Il faut se rendre sur la console Clever Cloud, se rendre sur la page de l'application qui nous intéresse (par exemple `potentiel-staging` et copier l'identifiant de l'application situé en haut de page (ex: app_ed751dc6-8ede-4c00-aa44-8f82a7f51efa)).

Vous pourrez ensuite lier cette application avec `clever-tools`

```
# l'option -a permet de nommer cette application
clever link -a staging app_ed751dc6-8ede-4c00-aa44-8f82a7f51efa
```

_**NB: ne jamais lier l'application de production**_

Nous pouvons ensuite déployer la branche locale via

```
clever deploy -a staging

# S'il y a un message d'erreur par rapport à la branche (non fast-forward)
clever deploy -a staging --force
 ``` -->

## Accès à la base de données distantes

De la même façon qu'en local, nous pouvons utiliser `psql` pour accèder aux bases distantes. Pour celà, nous créons un autre fichier `.env` (ex: `.env.staging`) spécifique à l'environnement cible, dans lequel nous mettons les credentials de la base distante (récupérée dans la console clever cloud). **Ne jamais avoir les credentials de la prod en local.**

```
dotenv -e .env.staging -- bash -c 'psql -h $POSTGRESQL_ADDON_HOST -p $POSTGRESQL_ADDON_PORT -U $POSTGRESQL_ADDON_USER -d $POSTGRESQL_ADDON_DB'
```

Il est également possible d'accèder aux données via PG Studio dans la console clever cloud.

## Créer un dump de base de données

Clever cloud produit des dump quotidiens de toutes les bases. Ils sont téléchargeables dans la console.

## Restaurer un dump de base de données

**Attention**: la ligne ci-dessous écrase toutes les données présentes sur la base distante.

```
export BACKUP_FILE=path/to/backup.dump
dotenv -- bash -c 'pg_restore --clean --no-owner --no-privileges -h $POSTGRESQL_ADDON_HOST -p $POSTGRESQL_ADDON_PORT -U $POSTGRESQL_ADDON_USER -d $POSTGRESQL_ADDON_DB --format=c $BACKUP_FILE'
```

_NB: Si le dump contient un schéma de données qui est en retard avec l'application dans son état actuel, il faut redéployer l'application afin que le script de migration soit rejouée sur la machine distante._
