# Flow de développement

## Table des matières
- [Organisation du code source](#organisation-du-code-source)
- [Scripts NPM](#scripts-npm)
- [Environnements](#environnements)
- [Déploiement](#deploy)
- [Apporter des changements](#apporter-des-changements)
- [Approche/Méthode](#approche-methode)

## <a id="organisation-du-code-source"></a> Organisation du code source

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

## <a id="scripts-npm"></a> Scripts NPM

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
- **lint** : Recherche de fix des problèmes de code via ESLint
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

## <a id="environnements"></a> Environnements

**Démo**
- https://demo.potentiel.incubateur.net
- Déployé automatiquement à chaque mise en production

**Staging**
- https://staging.potentiel.incubateur.net
- Déployé automatiquement à chaque création d'une branche release

**Production**
- https://potentiel.beta.gouv.fr
- Déployé manuellement depuis le workflow `Release workflow` depuis les actions Github du projet

## <a id="deploy"></a> Déploiement

Le projet potentiel suit la stratégie de branche de release : [Release Flow](http://releaseflow.org/).
Les différentes étapes du workflow déclenchent des déploiements automatiquement depuis les workflows github configurés.

Pour plus de détail vous pouvez consulter les diagrammes [release flow](./docs/ci/release-flow.drawio.svg) et [workflows](./docs/ci/workflows.drawio.svg).

## <a id="apporter-des-changements"></a> Apporter des changements

1. Créer une nouvelle branche à partir et à destination de la branche `master`

2. Implémenter vos changements

3. Une fois les changements terminés localement ouvrir une PR et demander la revue à au moins 1 autre développeur de l'équipe (idéalement 2).

4. Une fois que la PR est approuvée et que les changements demandés ont été apportés, la PR peut être merger .

Note : l'équipe utilise `gitmoji` pour les commits, donc merci de bien sélectionner l'emoji correspondant pour chaque commit avec un message clair en français. Cela facilite grandement la revue du code.

## <a id="approche-methode"></a> Approche/Méthode

- [**B**ehavior **D**riven **D**velopment](https://fr.wikipedia.org/wiki/Programmation_pilot%C3%A9e_par_le_comportement)

L'équipe de développement travaille en suivant la méthodologie BDD.
De ce fait chaque développement (nouvelle fonctionnalité ou correction de bug) commence par l'ajout ou la modification d'un scénario de test du package `specifications`

- [**D**omain **D**riven **D**esign](https://fr.wikipedia.org/wiki/Conception_pilot%C3%A9e_par_le_domaine)
