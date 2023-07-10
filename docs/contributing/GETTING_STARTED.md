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

1. Démarrer la base de données et lancer l'application en mode "watch" (redémarrage à chaque changement de fichier)

   ```bash
   npm start:dev
   ```

2. Se rendre sur [localhost:3000](http://localhost:3000)

3. Se connecter à l'un des comptes suivants (mot de passe : `test`):
   - admin@test.test
   - dreal@test.test
   - porteur@test.test
   - ademe@test.test
   - ao@test.test
   - dgec-validateur@test.test
   - cre@test.test
   - caissedesdepots@test.test

Pour stoper la base de données :

```bash
npm stop:dev
```

## <a id="lancer-les-tests"></a>Lancer les tests

### Specifications

Lancer tous les tests :

```shell
npm run specs
```

### Autres tests unitaires et d'intégration

Ces tests sont considéré comme étant du code `legacy`. Pour chaque nouveau développement implémenter les tests dans le package `specifications`

- Lancer tous les tests

  ```shell
  npm run test:legacy
  ```

- Lancer tous les tests, en relançant à chaque changement

  ```shell
  npm run test:legacy -- --watch
  ```

- Lancer un seul test, en relançant à chaque changement

  ```shell
  npm run test:legacy -- --watch src/modules/AppelOffre.spec.ts
  ```
