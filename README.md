# Suivi des Projets d'Energies Renouvelables

## Introduction

L’Etat français met en œuvre une politique volontariste de soutien au développement des énergies renouvelables (EnR) électriques. L’objectif est d’atteindre une part de 40% de ces énergies sur le total de l’électricité produite à l’horizon 2030. Chaque année, environ 1500 projets d’EnR électrique sont d’ores et déjà désignés lauréats d’un appel d’offre pour la production d’électricité renouvelable.

Potentiel permet de faciliter la gestion de ces projets, de gagner en traçabilité et en efficacité en fluidifiant les échanges entre porteurs de projets et administration (centrale et déconcentrée) et, à terme entre les divers opérateurs (acheteurs, gestionnaires de réseau, organismes de contrôle).

Le site est accessible sur [potentiel.beta.gouv.fr](https://potentiel.beta.gouv.fr).
Vous pouvez également consulter [les statistiques d'usage](https://potentiel.beta.gouv.fr/stats.html).

N'hésitez pas à regarder également la [fiche betagouv](https://beta.gouv.fr/startups/potentiel.html) du projet.

La suite de ce document explique comment lancer l'application sur sa machine et la déployer.

## Autre ressources

- [Guide d'utilisation](https://docs.potentiel.beta.gouv.fr)
- [Documentation de l'architecture](./docs/ARCHITECTURE.md)
- [Les grandes 'recettes' pour le développeur](./docs/RECIPES.md)

# Développement en local

## Mise en place initiale

### Pré-requis

- Node v14 ou plus
- npm v7 ou plus
- docker

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

4. Lancer les tests end-to-end

   ```shell

   # Tous, une fois
   npm run test-e2e

   # Ouvrir le studio cypress (mode conseillé en local)
   npm run cy:open
   ```

   _NB: L'application doit être en route (`npm run watch`)._

## Déploiement

L'application est actuellement déployée chez [Clever Cloud](https://www.clever-cloud.com), qui est un [PaaS](https://fr.wikipedia.org/wiki/Platform_as_a_service).

### Production

Pour la production, le déploiement se fait de manière automatisée à chaque push de la branche `master`, grace à l'execution d'une [Github Action](.github/workflows/deploy.prod.yml). Il s'agit d'une branche protégée. Il faut donc obligatoirement passer par une PR pour y contribuer.

### Staging / dev / démo

Pour les environnements de `staging` (recette), de `demo` ou de `dev`, le déploiement est manuel et se fait via l'outil de cli `clever-tools`.

#### Installation des clever-tools

```
npm install -g clever-tools
clever login
```

_NB: il faut avoir créé un compte sur clever cloud et avoir les droits d'accès à l'orga._

#### Déploiement

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
```

### Accès à la base de données distantes

De la même façon qu'en local, nous pouvons utiliser `psql` pour accèder aux bases distantes. Pour celà, nous créons un autre fichier `.env` (ex: `.env.staging`) spécifique à l'environnement cible, dans lequel nous mettons les credentials de la base distante (récupérée dans la console clever cloud). **Ne jamais avoir les credentials de la prod en local.**

```
dotenv -e .env.staging -- bash -c 'psql -h $POSTGRESQL_ADDON_HOST -p $POSTGRESQL_ADDON_PORT -U $POSTGRESQL_ADDON_USER -d $POSTGRESQL_ADDON_DB'
```

Il est également possible d'accèder aux données via PG Studio dans la console clever cloud.

### Créer un dump de base de données

Clever cloud produit des dump quotidiens de toutes les bases. Ils sont téléchargeables dans la console.

### Restaurer un dump de base de données

**Attention**: la ligne ci-dessous écrase toutes les données présentes sur la base distante.

```
export BACKUP_FILE=path/to/backup.dump
dotenv -- bash -c 'pg_restore --clean --no-owner --no-privileges -h $POSTGRESQL_ADDON_HOST -p $POSTGRESQL_ADDON_PORT -U $POSTGRESQL_ADDON_USER -d $POSTGRESQL_ADDON_DB --format=c $BACKUP_FILE'
```

_NB: Si le dump contient un schéma de données qui est en retard avec l'application dans son état actuel, il faut redéployer l'application afin que le script de migration soit rejouée sur la machine distante._
