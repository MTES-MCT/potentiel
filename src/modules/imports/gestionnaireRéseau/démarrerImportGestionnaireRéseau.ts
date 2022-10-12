import { EventStore, TransactionalRepository } from '@core/domain'
import { ImportGestionnaireRéseau } from './ImportGestionnaireRéseau'
import { User } from '@entities'
import { ImportGestionnaireRéseauDémarré } from './events'
import { errAsync } from 'neverthrow'
import { DémarrageImpossibleError } from './DémarrageImpossibleError'
import ImportGestionnaireRéseauId from './ImportGestionnaireRéseauId'
import { UnauthorizedError } from '@modules/shared'

type MakeDémarrerImportGestionnaireRéseauDépendances = {
  importRepo: TransactionalRepository<ImportGestionnaireRéseau>
  publishToEventStore: EventStore['publish']
}

type DémarrerImportGestionnaireRéseauCommande = {
  utilisateur: User
  gestionnaire: string
}

export const makeDémarrerImportGestionnaireRéseau =
  ({ importRepo, publishToEventStore }: MakeDémarrerImportGestionnaireRéseauDépendances) =>
  ({
    utilisateur: { id: démarréPar, role },
    gestionnaire,
  }: DémarrerImportGestionnaireRéseauCommande) => {
    if (role !== 'admin') {
      return errAsync(new UnauthorizedError())
    }

    return importRepo.transaction(
      ImportGestionnaireRéseauId.format(gestionnaire),
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
