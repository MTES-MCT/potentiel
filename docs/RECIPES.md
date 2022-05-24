# Recettes pour le développeur

- [Arborescence des fichiers](#arborescence)
- [Ecrire des tests](#écrire-des-tests)
- [Ecrire une query](#ecrire-une-query)
- [Déclencher une nouvelle notification par mail](#déclencher-une-nouvelle-notification-par-mail)
- [Créer une nouvelle projection](#créer-une-nouvelle-projection)
- [Ajout d'un événement de mise à jour de projection](#ajout-dun-événement-de-mise-à-jour-de-projection)

## Arborescence

```
.github/                      # github actions
.storybook/                   # configuration de storybook
.vscode/                      # configuration de vscode
clevercloud/                  # CRON à déclencher sur clever cloud
devtools/                     # scripts de génération de code (experimental)
docs/                         # documentation
scripts/                      # scripts qui sont executés soit manuellement, soit par CRON
src/                          # code source de l'application
  __tests__/                  # utilitaires pour les tests
  config/                     # configuration (injection de dépendances au lancement de l'application)
  controllers/                # controlleurs http (routes express)
  core/                       # types, définitions et utilitaires d'archi
  dataAccess/                 # anciens points d'accès à la donnée (legacy)
  entities/                   # anciens modèles de données (legacy)
  helpers/                    # utilitaires
  infra/                      # couche infrastructure de l'app
    file/                     # implémentations du FileService (S3, local, ...)
    inMemory/                 # implémentation in-memory de l'event store
    mail/                     # implémentations du mail service
    sequelize/                # implémentation sequelize de l'accès aux données
      __tests__/              # utilitaires pour les tests d'intégration sequelize
      eventStore/             # implémentation db de l'event store
      helpers/                # utilitaires
      migrations/             # scripts de migration (permet de mettre à jour les schémas de db via npm run migrate)
      projections/            # définitions de tables de projections et de leurs mises à jour
      queries/                # implémentation des queries
      repos/                  # implémentation des repositories
      seeds/                  # données de tests (permet de charger des données via npm run seed)
      models.ts               # instantiation des modèles sequelize
  modules/                    # briques métier
    [contextName]/            # contexte métier
      dtos/                   # définitions des DTOS
      errors/                 # définitions des erreurs
      events/                 # définitions des événements
      queries/                # définitions des queries
      eventHandlers/          # implémentation des handlers événementiels
      useCases/               # implémentations des commandes métier
      [Context].ts            # Implémentation de l'agrégat
  public/                     # fichiers statiques (css, images, polices, ...)
  types/                      # définition de types globaux (override des libs)
  useCases/                   # ancienne implémentation de commandes métier (legacy)
  views/                      # Vues (React)
    [...]
    legacy-pages/             # pages qui ont encore une dépendance à public/scripts.js pour leur comportement
    pages/                    # pages qui ont du comportement front géré par React + Webpack
  routes.ts                   # déclaration de toutes les routes de l'application
  sequelize.config.ts         # configuration de sequelize
  server.ts                   # point de lancement de l'application (serveur express + middlewares)
```

## Écrire des tests

Il y a trois catégories de tests qui ont leur utilité propre.

### Les tests unitaires

Les tests unitaires sont les premiers tests à être écrits lors de la création d'un nouveau use-case. Leur rôle principal est d'aider au développement (en mode TDD).
On crée un test-case super simple (juste un tout petit aspect de ce qui est attendu), on écrit l'implémentation minimale pour faire passer le test, on refactore puis on passe au test-case suivant.
Il est tentant de penser directement à l'implémentation finale (nommer toutes les dépendances et arguments) mais c'est contre-productif, parce qu'on finit par prendre une grande complexité d'un seul coup.
Il est préférable de se forcer à rester très incrémental. Un cycle écriture de test + implémentation doit durer quelques minutes, pas plus.

Les tests unitaires se situent dans le même dossier que le module testé et possède un suffixe `.spec.ts` (ie `/path/module.ts` est testé par `/path/module.spec.ts`). On les trouve en général dans les dossiers `modules` car ils testent du code métier. On peut aussi les trouver dans des helpers.

Ces tests n'ont aucune dépendance réelle, seulement des dépendances fausses créées via `jest.fn()` et injectée dans le constructeur du use-case (`makeMyUseCase`). Le seul `import` est donc le constructeur de use-case (et éventuellement d'autres éléments issus du domaine, ie d'un dossier `modules`). Jamais il ne doit y avoir de code d'infrastructure, comme une base de données ou un service tiers.

On injecte uniquement les comportement attendu dans ce test-case particulier. Une méthode qui doit respecter une interface de la forme `(userId: string) => Result<string, SomeError>` par exemple, sera injectée dans un cas avec `jest.fn((userId: string) => ok('John Doe')` et dans un autre cas avec `jest.fn((userId: string) => err(new SomeError()))`. On ne crée par de mock des dépendances avec un comportement "générique" qui serait réutilisé pour tous les test-case.
Si la dépendance injectée ne nous intéresse pas dans un test-case, on peut injecter `jest.fn()` qui n'aura aucun comportement mais suffira à appeler le constructeur.

Les tests unitaire pourront également servir pour détecter des régressions mais c'est secondaire. Les régressions détectées sont souvent liées à un changement d'interface/type partagée.

Les tests unitaires ne sont pas de grande utilité si le module est très simple.

### Les tests d'intégration

Les tests d'intégration servent à vérifier que la manière que nous avons d'appeler un service tiers (api, base de données, lib) est correcte. Dans ce cas, nous ne pouvons pas utiliser de faux et devons appeler une version réelle du service tiers.

Les tests unitaires se situent dans le même dossier que le module testé et possède un suffixe `.integration.ts` (ie `/path/module.ts` est testé par `/path/module.integration.ts`). On les trouve avant-tout dans les dossiers `infra` et jamais dans les `modules` (car le code métier ne dépend jamais de service tiers).

Le plus courant est d'écrire des tests d'intégration pour les query et les mises à jour de base de données. En général, notre code est simple mais le doute subsiste sur sa compatibilité avec le schéma de la base de données. Les tests d'intégration sont donc la seule manière de voir si c'est bon (sans lancer l'application elle-même).

Toujours dans l'esprit TDD, nous écrivons le test (simple) avant l'implémentation. Ici, nous avons besoin d'une vraie base de données, avec le vrai schéma (mais sans données). C'est pourquoi, nous lançons (via Docker) une instance de base de données.
Chaque test doit nettoyer la base au début de son lancement, pour être sur qu'il n'y a pas de pollution possible par les autres tests. Pour cette raison, les tests doivent être lancés de manière séquentielle et non parallèle.
Si notre test a besoin de données préalablement au test (par exemple, si on veut tester une mise à jour), alors on crée ces fausses données au début du test.

Les tests d'intégration permettent également de détecter des régressions. Si par exemple, le schéma de base de données change, il est possible que ça casse des requêtes sur celle-ci. Ce sont les tests d'intégration qui le réveleront.

## Ecrire une query

1. Ecrire l'interface de cette query dans le sous-dossier `modules` correspondant au context (ex: `src/modules/project/queries/GetProjectData.ts`)

- Il s'agit d'exporter un type qui décrit la méthode avec ses arguments et son résultat
  Ex:

```ts
export type GetProjectData = (args: {
  projectId: string
}) => ResultAsync<ProjectDataDTO, EntityNotFoundError>
```

2. Si le type de retour n'est pas trivial (ex: `string`, `number`,...) créer un DTO dans le sous-dossier correspondant (ex: `src/modules/project/dtos/ProjectDataDTO.ts`). Encore une fois, il s'agit d'exporter un type.
3. Ecrire l'implémentation de la query pour l'infra visée, en commençant par le test d'intégration:

- `src/infra/sequelize/queries/project/getProjectData.integration.ts`
- `src/infra/sequelize/queries/project/getProjectData.ts`

  _NB: Parfois l'implémentation peut paraitre triviale mais l'intérêt d'un test d'intégration est aussi de vérifier la validité des requêtes que nous faisons sur la table. Même si l'api est évidente, le schéma de base de données a pu changer et casser la requête._

## Déclencher une nouvelle notification par mail

- Créer un modèle sur [mailjet](https://app.mailjet.com/templates/transactional) (si un modèle n'existe pas)
  - Dans la barre en haut "modèles", puis "Mes modèles transactionnels".
  - Partir d'un modèle existant et faire "dupliquer" (en cliquant sur l'engrenage).
  - Le modifier et publier.
  - Copier l'identifiant à 7 chiffres du modèle.
- Ajouter un nouveau type de notification à `src/modules/notification/Notification.ts` et l'ajouter au type union `NotificationVariants`.

  Les `variables` correspondent aux variables du modèle mailjet.  
  Le `context` permet de rajouter du contexte à une notification (comme l'identifiant du destinataire ou bien du projet concerné) mais est totalement facultatif.  
  Donner un `type` spécifique et lisible.

- Ajouter une ligne à `TEMPLATE_ID_BY_TYPE` dans `src/infra/mail/mailjet.ts` en reprenant le `type` qui a été choisi à l'étape précédente et l'identifiant à 7 chiffres du modèle mailjet.
- Ajouter un handler (et son test unitaire) dans `src/modules/notification/eventHandlers`.

  Le nom canonique est de la forme `handle{Event.type}.ts` (par exemple `handleModificationRequested.ts` pour le handler sur l'événement `ModificationRequested`).

- Mettre à jour `src/modules/notification/eventHandlers/index.ts` (barrel)
- Brancher le handler sur l'eventStore dans `src/config/eventHandlers/notification.eventHandlers.ts`
- Tester en local

## Créer une nouvelle projection

Appelons cette projection `maproj` et imaginons qu'il s'agisse d'une projection sur l'infra `sequelize`.

- Créer un dossier `src/infra/sequelize/projections/maproj`
- Créer le fichier `src/infra/sequelize/projections/maproj/maproj.model.ts` de la forme:

```ts
import { DataTypes } from 'sequelize'
import { makeProjector } from '../../helpers'

export const maprojProjector = makeProjector()

export const makeMaprojModel = (sequelize) => {
  const model = sequelize.define('maproj', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    // ... autres champs
  })

  model.associate = (models) => {
    // Associations avec d'autres models
    // Exemple:
    // const { Other } = models
    // model.hasMany(Other)
  }

  model.projector = maprojProjector

  return model
}
```

- Mettre à jour `src/infra/sequelize/projections/index.ts` pour inclure le nouveau dossier (barrel)

- `npx sequelize-cli migration:generate --name create-maproj` puis éditer le fichier généré pour ajouter la table avec le schéma contenu dans `maproj.model.ts`
  Penser à rajouter les colonnes:

```ts
  createdAt: Sequelize.DataTypes.DATE,
  updatedAt: Sequelize.DataTypes.DATE,
```

- Dans le fichier `src/infra/sequelize/models.ts`, ajouter la ligne:

```ts
export const models = {
  // ...autres models
  Maproj: makeMaproj,
}
```

## Ajout d'un événement de mise à jour de projection

Soient la projection `maproj` et l'événement `MyEvent`.

- Créer le fichier `src/infra/sequelize/projections/maproj/updates/onMyEvent.ts` de la forme:

```ts
import { maprojProjector } from '../maproj.model'

// Pour une création
export const onMyEvent = maprojProjector
  .on(MyEvent)
  .insert(({ payload: { id, name }, occurredAt }) => ({
    id,
    name,
    createdAt: occurredAt,
  }))

// Pour une mise à jour
export const onMyEvent = maprojProjector.on(MyEvent).update({
  where: ({ payload: { id } }) => ({ id }),
  delta: ({ payload: { name } }) => ({ name }),
})
```

- Mettre à jour `src/infra/sequelize/projections/maproj/updates/index.ts` (barrel)
