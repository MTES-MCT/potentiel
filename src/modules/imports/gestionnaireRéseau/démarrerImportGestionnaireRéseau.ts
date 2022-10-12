import { EventStore, TransactionalRepository } from '@core/domain'
import { ImportGestionnaireRéseau } from './ImportGestionnaireRéseau'
import { User } from '@entities'
import { ImportGestionnaireRéseauDémarré, MiseAJourDateMiseEnServiceDémarrée } from './events'
import { errAsync } from 'neverthrow'
import { DémarrageImpossibleError } from './DémarrageImpossibleError'
import ImportGestionnaireRéseauId from './ImportGestionnaireRéseauId'
import { UnauthorizedError } from '@modules/shared'
import { DonnéesDeMiseAJourObligatoiresError } from './DonnéesDeMiseAJourObligatoiresError'

type MakeDémarrerImportGestionnaireRéseauDépendances = {
  importRepo: TransactionalRepository<ImportGestionnaireRéseau>
  publishToEventStore: EventStore['publish']
}

export type DémarrerImportGestionnaireRéseauCommande = {
  utilisateur: User
  gestionnaire: string
  données: Array<{ numeroGestionnaire: string; dateMiseEnService: Date }>
}

export const makeDémarrerImportGestionnaireRéseau =
  ({ importRepo, publishToEventStore }: MakeDémarrerImportGestionnaireRéseauDépendances) =>
  (commande: DémarrerImportGestionnaireRéseauCommande) => {
    const {
      utilisateur: { id: démarréPar, role },
      gestionnaire,
      données,
    } = commande

    if (role !== 'admin') {
      return errAsync(new UnauthorizedError())
    }

    return importRepo.transaction(
      ImportGestionnaireRéseauId.format(gestionnaire),
      (importGestionnaireRéseau) => {
        if (importGestionnaireRéseau.état === 'en cours') {
          return errAsync(new DémarrageImpossibleError(commande))
        }

        if (données.length === 0) {
          return errAsync(new DonnéesDeMiseAJourObligatoiresError(commande))
        }

        return publishToEventStore(
          new MiseAJourDateMiseEnServiceDémarrée({
            payload: {
              gestionnaire,
              dates: données.map(({ numeroGestionnaire, dateMiseEnService }) => ({
                numeroGestionnaire,
                dateMiseEnService: dateMiseEnService.toISOString(),
              })),
            },
          })
        ).andThen(() =>
          publishToEventStore(
            new ImportGestionnaireRéseauDémarré({
              payload: {
                démarréPar,
                gestionnaire,
              },
            })
          )
        )
      }
    )
  }
