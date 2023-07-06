# Premiers pas dans le projet Potentiel

## Table des matières
- [Mise en place du projet](#mise-en-place-du-projet)
- [Configurer un environnement local](#configurer-un-environnement-local)
- [Lancer l'application en local](#lancer-application-en-local)
- [Lancer les tests](#lancer-les-tests)

## <a id="mise-en-place-du-projet"></a> Mise en place du projet

Pour installer et lancer le projet vous aurez besoin de :
- <a href="https://github.com/nvm-sh/nvm#installing-and-updating" target="_blank">NVM</a>
- <a href="https://docs.docker.com/get-docker/" target="_blank">Docker</a>

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

6. Configurer Gitmoji pour l'utilisation des Emojis (♻️) plutôt que des Emoji codes (_:recycle:_) :

   ```bash
   gitmoji -g
   ```

7. Configurer les variables d'environnement :

   ```bash
   cp .env.template .env
   ```

## <a id="lancer-application-en-local"></a> Lancer l'application en local

1. Démarrer la base de données via le script npm *dev-db* :
   ```bash
   npm run dev-db
   ```

2. Créer la structure de la base de données en utilisant le script npm *migrate* :
   ```bash
   npm run migrate
   ```

3. Ajouter des données par défaut en utilisant le script npm *seed* :

   ```bash
   npm run seed
   ```

4. Lancer l'application en mode "watch" (redémarrage à chaque changement de fichier)

   ```bash
   npm run watch
   ```

5. Se rendre sur [localhost:3000](http://localhost:3000)

6. Se connecter à l'un des comptes suivants (pas de mot de passe nécessaire):
   - admin@test.test
   - dreal@test.test
   - porteur@test.test
   - ademe@test.test
   - ao@test.test
   - dgec-validateur@test.test
   - cre@test.test
   - caissedesdepots@test.test

## <a id="lancer-les-tests"></a>Lancer les tests

### Specifications

1. Démarrer la base de données de test via le script npm *test-db* :

   ```shell
   npm run test-db
   ```

2. Lancer ensuite la commande :

   ```shell
   npm run test:packages
   ```

### Autres tests unitaires et d'intégration

Ces tests sont considéré comme étant du code `legacy`. Pour chaque nouveau développement implémenter les tests dans le package `specifications`

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
