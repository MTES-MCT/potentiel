# Pull requests

- [Dépendances](#dépendances)
- [Configurer un environnement local](#configurer-un-environnement-local)
- [Lancer une première fois l'application](#lancer-une-première-fois-lapplication)
- [Lancer les tests](#lancer-les-tests)
- [Organisation du code source](#organisation-du-code-source)
- [Apporter des changements](#apporter-des-changements)
- [Approche/Méthode](#approcheméthode)
- [Patterns d'architecture](#patterns-darchitecture)

## Dépendances

- <a href="https://github.com/nvm-sh/nvm#installing-and-updating" target="_blank">NVM</a>
- <a href="https://docs.docker.com/get-docker/" target="_blank">Docker</a>

## Configurer un environnement local

1. Cloner le repository

   ```bash
   git clone https://github.com/MTES-MCT/potentiel.git
   cd potentiel
   ```

1. Installer Node.js via la commande **nvm** à la racine du projet (**nvm** utilisera la configuration contenue dans le fichier **[.nvmrc](/.nvmrc)**) :

   ```bash
   nvm install
   ```

1. Installer les dépendances :

   ```bash
   npm install
   ```

1. Pour contribuer, installer le package **[gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli)** :

   ```bash
   npm i -g gitmoji-cli
   ```

1. Installer le commit hook de Gitmoji :

   ```bash
   gitmoji -i
   ```

1. Configurer Gitmoji pour l'utilisation des Emojis (♻️) plutôt que des Emoji codes (_:recycle:_) :

   ```bash
   gitmoji -g
   ```

1. Configurer les variables d'environnement :

   ```bash
   cp .env.template .env
   ```

## Lancer une première fois l'application

1. Démarrer les containers :

   ```bash
   npm run dev-db
   ```

1. Préparer la base de données

   ```bash
   npm run migrate
   ```

1. Ajouter des données par défaut

   ```bash
   npm run seed
   ```

1. Lancer l'application en mode "watch" (redémarrage à chaque changement de fichier)

   ```bash
   npm run watch
   ```

1. Se rendre sur [localhost:3000](http://localhost:3000)
1. Se connecter à l'un des comptes suivants (pas de mot de passe nécessaire):
   - admin@test.test
   - dreal@test.test
   - porteur@test.test
   - ademe@test.test
   - ao@test.test
   - dgec-validateur@test.test
   - cre@test.test
   - caissedesdepots@test.test

## Lancer les tests

### Specifications

1. Préparer une base de données de test

   ```shell
   npm run test-db
   ```

1. Lancer la commande :

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

1. Lancer les tests unitaires

   ```shell
   # Tous, une fois
   npm run test

   # Tous, en relançant à chaque changement
   npm run test -- --watch

   # Un seul test, en relançant à chaque changement
   npm run test -- --watch src/modules/AppelOffre.spec.ts
   ```

1. Lancer les tests d'intégration

   ```shell
   # Tous, une fois
   npm run test-int

   # Tous, en relançant à chaque changement
   npm run test-int -- --watch

   # Un seul test, en relançant à chaque changement
   npm run test-int -- --watch src/modules/AppelOffre.spec.ts
   ```

   _NB: Si le schéma de base de données a changé, il faut relancer `npm run test-db`._

## Organisation du code source

Actuellement le projet est en cours de refonte pour passer en organisation en workspaces.

La partie dans le répertoire `src` correspond au code source qui doit être migrer dans des `packages`. Donc toute modification dans cette partie doit être faite seulement pour corriger des corrections de bugs bloquants ou de sécurité.

Toute nouvelle fonctionnalité doit être implémenter sous forme de paquets situés dans le répertoire `packages`.

Une exception est faite pour la partie `Front-end` de l'application dont le plan d'action de migration en package n'a pas encore été initié.

Nous avons donc :

```
├── .demo : fichiers pour l'environnement de démo
├── .github : workflows des actions Github
├── .husky : hooks husky
├── .storybook : configuration du storybook
├── .vscode : fichiers partagés pour l'IDE VS Code
├── docs : documentation sur le projet
├── keycloak-legacy :
├── packages : code source des nouvelles fonctionnalités implémentées sur le nouveau socle
|   ├── applications
|   |   ├── web : application web
|   ├── domain : core source métier
|   ├── libraries : librairies du projet
|   ├── specifications : scénarios de tests de toute l'application
├── scripts : divers scripts utilitaires
├── src : code source des fonctionnalités à migrer dans la partie `packages`
```

## Apporter des changements

1. Créer une nouvelle branche à partir et à destination de la branche `master`
1. Implémenter vos changements

1. Une fois les changements terminés localement ouvrir une PR et demander la revue à au moins 1 autre développeur de l'équipe (idéalement 2).

1. Une fois que la PR est approuvée et que les changements demandés ont été apportés, la PR peut être merger .

Note : l'équipe utilise `gitmoji` pour les commits, donc merci de bien sélectionner l'emoji correspondant pour chaque commit avec un message clair en français. Cela facilite grandement la revue du code.

## Approche/Méthode

- [**B**ehavior **D**riven **D**velopment](https://fr.wikipedia.org/wiki/Programmation_pilot%C3%A9e_par_le_comportement)

L'équipe de développement travaille en suivant la méthodologie BDD.
De ce fait chaque développement (nouvelle fonctionnalité ou correction de bug) commence par l'ajout ou la modification d'un scénario de test du package `specifications`

- [**D**omain **D**riven **D**esign](https://fr.wikipedia.org/wiki/Conception_pilot%C3%A9e_par_le_domaine)

## Patterns d'architecture

- [Event Sourcing](https://fr.wikipedia.org/wiki/Architecture_orient%C3%A9e_%C3%A9v%C3%A9nements)
- [CQRS](https://fr.wikipedia.org/wiki/S%C3%A9paration_commande-requ%C3%AAte)
