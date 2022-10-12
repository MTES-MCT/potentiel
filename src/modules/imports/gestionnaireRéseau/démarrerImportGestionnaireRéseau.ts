import { EventStore, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { ImportGestionnaireRéseau } from './ImportGestionnaireRéseau'
import { User } from '@entities'
import { ImportGestionnaireRéseauDémarré } from './events'
import { errAsync } from 'neverthrow'
import { DémarrageImpossibleError } from './DémarrageImpossibleError'

type MakeDémarrerImportGestionnaireRéseauDépendances = {
  importRepo: TransactionalRepository<ImportGestionnaireRéseau>
  publishToEventStore: EventStore['publish']
}

type DémarrerImportGestionnaireRéseauCommande = {
  utilisateur: User
  gestionnaire: string
}

const makeImportGestionnaireRéseauAggregateId = (gestionnaire: string) =>
  new UniqueEntityID(`import-gestionnaire-réseau#${gestionnaire}`)

export const makeDémarrerImportGestionnaireRéseau =
  ({ importRepo, publishToEventStore }: MakeDémarrerImportGestionnaireRéseauDépendances) =>
  ({ utilisateur: { id: démarréPar }, gestionnaire }: DémarrerImportGestionnaireRéseauCommande) => {
    return importRepo.transaction(
      makeImportGestionnaireRéseauAggregateId(gestionnaire),
      (importGestionnaireRéseau) => {
        if (importGestionnaireRéseau.état === 'en cours') {
          return errAsync(new DémarrageImpossibleError({ gestionnaire }))
        }

        return publishToEventStore(
          new ImportGestionnaireRéseauDémarré({
            payload: {
              démarréPar,
              gestionnaire,
            },
          })
        )
      }
    )
  }
