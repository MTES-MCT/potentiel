# Recettes pour le développeur

- [Déclencher une nouvelle notification par mail](#déclencher-une-nouvelle-notification-par-mail)
- [Créer une nouvelle projection](#créer-une-nouvelle-projection)
- [Ajout d'un événement de mise à jour de projection](#ajout-dun-événement-de-mise-à-jour-de-projection)

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
