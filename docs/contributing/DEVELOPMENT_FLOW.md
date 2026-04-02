# Flow de développement

## Table des matières

- [Flow de développement](#flow-de-développement)
  - [Table des matières](#table-des-matières)
  - [ Approche/Méthode](#-approcheméthode)
  - [ Organisation du code source](#-organisation-du-code-source)
  - [ Scripts NPM](#-scripts-npm)
  - [ Environnements](#-environnements)
    - [ Remise à zéro d'un environnement de test](#-remise-à-zéro-dun-environnement-de-test)
  - [ Déploiement](#-déploiement)
  - [ Review App](#-review-app)
    - [Manuellement](#manuellement)
    - [Via script](#via-script)
  - [ Apporter des changements](#-apporter-des-changements)
  - [ Faire un hotfix](#-faire-un-hotfix)
  - [ Récupérer les modifications d'une branche release vers main](#-récupérer-les-modifications-dune-branche-release-vers-main)
  - [ Mettre l'application en mode maintenance](#-mettre-lapplication-en-mode-maintenance)

## <a id="approche-methode"></a> Approche/Méthode

- [**B**ehavior **D**riven **D**velopment](https://fr.wikipedia.org/wiki/Programmation_pilot%C3%A9e_par_le_comportement)

L'équipe de développement travaille en suivant la méthodologie BDD.
De ce fait chaque développement (nouvelle fonctionnalité ou correction de bug) commence par l'ajout ou la modification d'un scénario de test du package `specifications`

- [**D**omain **D**riven **D**esign](https://fr.wikipedia.org/wiki/Conception_pilot%C3%A9e_par_le_domaine)

## <a id="organisation-du-code-source"></a> Organisation du code source

Actuellement le projet est en cours de refonte pour passer en organisation en workspaces.

La partie dans le répertoire `src` correspond au code source qui doit être migrer dans des `packages`. Donc toute modification dans cette partie doit être faite seulement pour des corrections de bugs bloquants ou de sécurité.

Toute nouvelle fonctionnalité doit être implémentée sous forme de paquets situés dans le répertoire `packages`.

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
├── packages
|   ├── applications
|   |   ├── ssr : application web, point d'entrée de l'application
|   ├── domain : core source métier
|   ├── libraries : librairies du projet
|   ├── specifications : scénarios de tests de toute l'application
├── scripts : divers scripts utilitaires
├── src : code source des fonctionnalités à migrer dans la partie `packages`
```

## <a id="scripts-npm"></a> Scripts NPM

Vous trouverez ci-dessous une description du fonctionnement de l'ensemble des scripts NPM du projet :

- `prepare` : Exécute Husky, un outil pour gérer les hooks Git avec lint-staged. Cela permet de configurer automatiquement les hooks Git après l'installation des dépendances.

- `start` : Lance l'application comme en production, en démarrant `web` et `subscribers`

- `up` : Démarre les services définis dans le fichier `docker-compose` avec le profil `app`, et attend que la base de données soit prête avant de continuer.

- `down` : Arrête et supprime les conteneurs Docker qui ont été lancés avec le profil `app`, en supprimant également les orphelins.

- `build` : Build le projet dans son ensemble

- `build:dev` : Build les dépendences nécessaires aux applications et specifications.

- `build:test` : Build le projet pour les tests.

- `clean` : Supprime les artefacts générés par le build.

- `dev` : Lance l'application ssr en mode développement

- `lint` : Exécute ESLint pour identifier et signaler les patterns trouvés dans le code.

- `lint:fix` : Exécute ESLint avec l'option `--fix` pour corriger automatiquement les problèmes de code détectables.

- `format` : Formate le code dans tous les workspaces qui définissent le script `format`, si présent.

- `storybook:documents` : Build le Storybook pour les documents.

- `up:test` : Lance les services Docker nécessaires pour les tests avec le profil `test` et attend que la base de données soit prête.

- `down:test` : Arrête et supprime les conteneurs Docker lancés pour les tests, en supprimant également les orphelins.

- `test:libraries` : Exécute les tests pour les bibliothèques.

- `specs` : Exécute les spécifications.

- `specs:select` : Exécute une sélection de spécifications.

- `update:dump` : Génére un fichier .dump de la base `potentiel`

- `update:dump-metabase` : Génére un fichier .dump de la base `metabase`

- `update:ts-references` : Met à jour les références des fichiers tsconfig.json en fonction des dépendences de chaque paquet.

## <a id="environnements"></a> Environnements

Liste des environnements sur Scalingo :

**Démo**

- https://demo.potentiel.incubateur.net
- Déployé automatiquement à chaque mise en production

**Staging**

- https://staging.potentiel.incubateur.net
- Déployé automatiquement à chaque création d'une branche release

**Production**

- https://potentiel.beta.gouv.fr
- Déployé manuellement depuis le workflow `Release workflow` depuis les actions Github du projet

### <a id="raz-environnement"></a> Remise à zéro d'un environnement de test

Le script `.database/scripts/restore-test-env-db.sh` permet une remise à zéro de la base de donnée d'un environnement de test. Il peut être éxécuté depuis un [terminal one-off](https://doc.scalingo.com/platform/app/tasks#run-an-attached-one-off) :

```bash
scalingo run --app XXX .database/scripts/restore-test-env-db.sh
```

Par ailleurs, la commande `potentiel-cli seed files` permet de générer les documents "manquants" dans l'environnement, et ainsi éviter des erreurs liées à l'absence de ces documents lors des tests.

## <a id="deploiement"></a> Déploiement

Le projet potentiel suit la stratégie de branche de release : [Release Flow](http://releaseflow.org/).
Les différentes étapes du workflow déclenchent des déploiements automatiquement depuis les workflows github configurés.

Pour plus de détail vous pouvez consulter les diagrammes [release flow](../ci/release-flow.drawio.svg) et [workflows](../ci/workflows.drawio.svg).

## <a id="review-app"></a> Review App

Il est possible de crée un environnement temporaire pour une Pull Request, grâce aux [Review apps Scalingo](https://doc.scalingo.com/platform/app/review-apps).

> Par défaut, seule l'authentification par lien magique est disponible.
>
> Pour activer Keycloak, modifier AUTH_PROVIDERS et ajouter l'URL de la review app aux URLs autorisées dans Keycloak.

### Manuellement

Déclencher le déploiement depuis l'application `potentiel-dev`, onglet Review Apps, Manual deployment.
Si le déploiement n'est pas immédiat, c'est probablement que la CI n'est pas terminée sur Github. Il est possible de déclancher manuellement pour ne pas attendre, sous Deploy.

Une fois le premier déploiement terminé, modifier dans Resources le nombre d'instances de 0 à 1 pour chaque container.

### Via script

Lancer le script `scripts/review-app.sh` depuis la branche liée à la PR souhaitée (la PR doit exister), et suivre les instructions.

## <a id="apporter-des-changements"></a> Apporter des changements

1. Créer une nouvelle branche à partir et à destination de la branche `main`

2. Implémenter vos changements en respectant la [convention de codage](./CODING_CONVENTION.md).

3. Une fois les changements terminés localement ouvrir une PR et demander la revue à au moins un autre développeur de l'équipe (idéalement 2).

4. Une fois que la PR est approuvée et que les changements demandés ont été apportés, la PR peut être mergée.

Note : l'équipe utilise `gitmoji` pour les commits, donc merci de bien sélectionner l'emoji correspondant pour chaque commit avec un message clair en français. Cela facilite grandement la revue du code.

## <a id="faire-un-hotfix"></a> Faire un hotfix

1. Créer une nouvelle branche à partir de la branche release actuellement en production. Pour rappel, les branches release doivent suivre ce format : \release/x.xx\

2. Implémenter vos changements

3. Une fois les changemements terminés ouvrir une PR qui pointe vers la branche release en production

4. Une fois mergée, créer une PR de la release actuellement en production vers main. ⚠️ Au moment du merge, bien penser à faire un **merge commit** plutôt qu'un squash) en ajoutant le message générique suivant : "🔀 Intégration des dernières modification de la version X.XX"

5. Une fois la PR mergée, penser à **restaurer la branche release** qui a été supprimé automatiquement

## <a id="récupérer-modifications-branche-release-vers-main"></a> Récupérer les modifications d'une branche release vers main

1. Créer une branche qui part de la **release x.x**, et ouvrir la PR vers main, titre `🔀 Intégration des modifications de la release x.x`
2. Si pas de conflits, merger la PR en sélectionnant le mode **merge commit**
3. Si conflits
   1. Créer une branche qui part de main, exemple : `integrate-release-x.x`
   2. faire un `git merge release/x.x` pour récupérer les modifications de la release dans notre branche
   3. Gérer les conflits et nommer le message du commit comme ceci : `🔀 Resolve merge conflicts after merge`
   4. Ouvrir la PR en mettant comme titre de la PR : `🔀 Intégration des modifications de la release x.x`
   5. Merger la PR en sélectionnant le mode **merge commit**

## <a id="mettre-app-en-mode-maintenance"></a> Mettre l'application en mode maintenance

On a parfois besoin de passer l'app en mode maitenance quand on doit pas exemple faire des modifications sur l'event store ou encore regéner les subscribers.

Actuellement le site est hébergé sur Scalingo, nous utilisons donc le [mécanisme de variables d'environnement](https://doc.scalingo.com/platform/app/custom-error-page) pour définir les pages à afficher en fonction des contextes.

Pour mettre l'application en maintenance, il faut éteindre l'application `web` en passant la quantity à `0` dans l'onglet [resources](https://dashboard.scalingo.com/apps/osc-secnum-fr1/potentiel-production/resources)

Une fois la maintenance effectuée, on peut repasser la valeur à `1` et bien penser à redémarrer l'application
