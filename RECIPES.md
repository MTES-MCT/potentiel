# Recettes pour le développeur

- (Créer une nouvelle projection)[#Créer une nouvelle projection]

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
