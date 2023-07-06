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

## Lancer l'application

> ℹ️ Pour démarrer l'application vous aurez besoin de Docker 🐋

1. Lancer l'application via le script npm **start:dev** :

```bash
npm run start:dev
```

2. Se rendre sur [localhost:3000](http://localhost:3000)
3. Se connecter à l'un des comptes suivants (mot de passe pour tous les comptes : **test**):
   - admin@test.test
   - dreal@test.test
   - porteur@test.test
   - ademe@test.test
   - ao@test.test
   - dgec-validateur@test.test
   - cre@test.test
   - caissedesdepots@test.test

> ℹ️ Il est possible de couper les services utilisés localement pour lancer l'application via le script npm **`stop:dev`**
 
## Lancer les tests

### Specifications

Il existe deux types de test dans le projet, les tests dit **`legacy`** (couvrant l'ancien socle technique de manière disparatent) et les tests dit de **`specifications`** liés au nouveau socle mise en place en Behavior Driven Development.

1. Pour lancer les tests **`legacy`**, vous pouvez utiliser le script npm **`test:legacy`** :
   ```shell
   npm run test:legacy
   ```

2. Pour lancer les tests de **`specifications`**, vous pouvez utiliser le script npm `specs` :
   ```shell
   npm run specs
   ```
3. Il est possible de lancer les tests de **`specifications`** uniquement sur certains scénarios. Pour se faire, ajoutez un tag **`@select`** sur les scénarios que vous voulez lancer. Exemple :

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

## Scripts NPM

Vous trouverez ci-dessous une description du fonctionnement de l'ensemble des scripts NPM du projet :
- **type:check** : Lance le compilateur pour vérifier le typage. Ce script ne produit aucun fichier js en sortie
- **build** : Compile l'ensemble du projet (bibliothéque, CSS, Front, Backend)
- **build:back** : Compile le backend
- **build:css** : Compile le CSS via Tailwind
- **build:front** : Compile le Frontend via Webpack
- **build:packages** : Compile les bibliothéques TypeScript
- **build:migrations** : Compile les fichiers de migration et de seed
- **build-storybook** : Compile Storybook
- **prepare** : Met en place Husky pour la bonne éxécution des Hooks via lint-staged
- **lint** : Recherche de fix des problémes de code via ESLint
- **format** : Formattage du code via Prettier
- **migrate** : Execute les migrations de base de données
- **migrate:undo** : Annule la derniére migration de base de données éxécutée
- **seed** : Ajoute les données de base pour le lancement de l'application en local
- **start:dev** : Lance les services locaux nécessaire au fonctionnement de l'app (Postgres, S3, Keycloack), éxecute les migrations de base de données, compile l'ensemble du projet et le lance en mode watch
- **stop:dev** : Coupe les services locaux nécessaire au fonctionnement de l'app
- **start** : Lancement de l'application en mode production. Execute les migrations de base de données, compile l'ensemble du projet et le lance.
- **specs** : Execute les tests de `specifications`. Lance les services locaux nécessaire à l'éxecution des tests, éxecute les migrations de base de données, compile l'ensemble du projet et éxecute les scénarios Gherkin
- **specs:select** : Similaire à **specs**, mais ne lance que les scénarios Gherkin taggés avec **@select**
- **version** : Calcul le numéro de version de l'application.
> ⚠️ Attention, ce script n'est utilisé que par la CI
- **test:legacy** : Similaire à **specs**, mais lance uniquement les tests unitaire et d'intégration mise en place avec Jest
- **storybook** : Lance Storybook

## Apporter des changements

1. Créer une nouvelle branche à partir et à destination de la branche `master`
2. Implémenter vos changements

3. Une fois les changements terminés localement ouvrir une PR et demander la revue à au moins 1 autre développeur de l'équipe (idéalement 2).

4. Une fois que la PR est approuvée et que les changements demandés ont été apportés, la PR peut être merger .

Note : l'équipe utilise `gitmoji` pour les commits, donc merci de bien sélectionner l'emoji correspondant pour chaque commit avec un message clair en français. Cela facilite grandement la revue du code.

## Approche/Méthode

- [**B**ehavior **D**riven **D**velopment](https://fr.wikipedia.org/wiki/Programmation_pilot%C3%A9e_par_le_comportement)

L'équipe de développement travaille en suivant la méthodologie BDD.
De ce fait chaque développement (nouvelle fonctionnalité ou correction de bug) commence par l'ajout ou la modification d'un scénario de test du package **`specifications`**.

- [**D**omain **D**riven **D**esign](https://fr.wikipedia.org/wiki/Conception_pilot%C3%A9e_par_le_domaine)

## Patterns d'architecture

- [Event Sourcing](https://fr.wikipedia.org/wiki/Architecture_orient%C3%A9e_%C3%A9v%C3%A9nements)
- [CQRS](https://fr.wikipedia.org/wiki/S%C3%A9paration_commande-requ%C3%AAte)
