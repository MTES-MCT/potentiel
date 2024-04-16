# Premiers pas dans le projet Potentiel

## Table des matières

- [Mise en place du projet](#mise-en-place-du-projet)
- [Système d'authentification avec Keycloak](#keycloak)
- [Configurer un environnement local](#configurer-un-environnement-local)
- [Lancer l'application en local](#lancer-application-en-local)
- [Avoir des données de test en local](#avoir-des-donnees-de-test-en-local)
- [Lancer les tests](#lancer-les-tests)
- [Metabase](#metabase)
- [Restaurer un dump de la base](#restaurer-dump-db)

## <a id="mise-en-place-du-projet"></a> Mise en place du projet

Pour installer et lancer le projet vous aurez besoin de :

- <a href="https://github.com/nvm-sh/nvm#installing-and-updating" target="_blank">NVM</a>
- <a href="https://docs.docker.com/get-docker/" target="_blank">Docker</a>

## <a id="keycloak"></a> Système d'authentification avec Keycloak

Keycloak est un service open source d'identité et de gestion d'accès. Pour comprendre comment ce service est mise en oeuvre, vous pouvez trouver la documentation sur le [repo dédié au thème](https://github.com/MTES-MCT/potentiel-keycloak#mise-en-oeuvre).

En local, lorsque la commande `npm run start:dev` (ou `docker compose up -d`) est lancée, un container `auth` va se monter avec l'[image officielle de Keycloak](https://quay.io/repository/keycloak/keycloak).

Lors du montage de l'image, le fichier [realm-dev.json](./keycloak/import/realm-dev.json) est importé et va configurer le royaume keycloak pour l'environnement de dev, et y ajouter des utilisateurs de tests.

Pour les environnements de production et de staging, Keycloak est hébergé sur une application scalingo et utilise le [repo du thème custom](https://github.com/MTES-MCT/potentiel-keycloak).

## <a id="configurer-un-environnement-local"></a> Configurer un environnement local

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

## <a id="lancer-application-en-local"></a> Lancer l'application en local

> ⚠️ Pour démarrer l'application vous aurez besoin de Docker 🐋

1. Lancer l'application via le script npm **start:dev** :

```bash
npm run start:dev
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

> ℹ️ Il est possible de couper les services utilisés localement pour lancer l'application via le script npm **`stop:dev`**

## <a id="avoir-des-donnees-de-test-en-local"></a> Avoir des données de test en local

0. [Lancer l'application en local](#lancer-application-en-local)

1. Récupérer les fichiers présents dans `.demo`

2. Se connecter au compte test **dgec-validateur@test.test** (mot de passe **test**)

3. Dans l'interface

- Importer un fichier

Se rendre dans l'onglet Imports >> Nouveaux Candidats >> Choisir un fichier (un des fichiers de `.demo`) >> Envoyer.

- Valider les candidats

Se rendre dans l'onglet Désignation >> Notifier les Candidats >> Notifier tous les candidats de la période.

- Se connecter à n'importe quel compte de test en fonction des besoins

## <a id="lancer-les-tests"></a>Lancer les tests

### Specifications

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

## <a id="metabase"></a> Metabase

Nous utilisons metabase pour faire des analyses en mode no-code sur la base de données.

Il s'agit d'un service autonome qui est déployé sur sa propre instance Scalingo et a sa propre base de données (pour la configuration).

Metabase est connecté à la base de données de production via un utilisateur read-only.

Afin de déployer ou mettre à jour l'instance METABASE il suffit de suivre la procédure décrite dans la doc Scalingo ici :
https://doc.scalingo.com/platform/getting-started/getting-started-with-metabase

## <a id="restaurer-dump-db"></a> Restaurer un dump de la base de donnée

- Pour cette partie il vaut mieux préférer la méthode "one-off-container" en téléchargeant le dump directement sur les serveurs Scalingo.

`scalingo --app [nom-de-l-application] run --file ./potentiel.dump bash`

- Il faut ensuite installer les outils postgres.

`dbclient-fetcher psql`

- Enfin restaurer le dump téléchargé sur le container dans le répertoire /tmp/upload.

`pg_restore --clean --if-exists --no-owner --no-privileges --no-comments --dbname $DATABASE_URL /tmp/uploads/potentiel.dump`
