import { EventStore, TransactionalRepository } from '@core/domain'
import { ImportGestionnaireRéseau } from './ImportGestionnaireRéseau'
import { User } from '@entities'
import { MiseAJourDateMiseEnServiceDémarrée } from './events'
import { errAsync } from 'neverthrow'
import { DémarrageImpossibleError } from './DémarrageImpossibleError'
import ImportGestionnaireRéseauId from './ImportGestionnaireRéseauId'
import { UnauthorizedError } from '@modules/shared'
import { DonnéesDeMiseAJourObligatoiresError } from './DonnéesDeMiseAJourObligatoiresError'
import { userIsNot } from '@modules/users'

type MakeDémarrerImportGestionnaireRéseauDépendances = {
  importRepo: TransactionalRepository<ImportGestionnaireRéseau>
  publishToEventStore: EventStore['publish']
}

export type DémarrerImportGestionnaireRéseauCommande = {
  utilisateur: User
  gestionnaire: 'Enedis'
  données: Array<{ numeroGestionnaire: string; dateMiseEnService: Date }>
}

export const makeDémarrerImportGestionnaireRéseau =
  ({ importRepo, publishToEventStore }: MakeDémarrerImportGestionnaireRéseauDépendances) =>
  (commande: DémarrerImportGestionnaireRéseauCommande) => {
    const { utilisateur, gestionnaire, données } = commande

    if (userIsNot('admin')(utilisateur)) {
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
              misAJourPar: utilisateur.id,
              gestionnaire,
              dates: données.map(({ numeroGestionnaire, dateMiseEnService }) => ({
                numeroGestionnaire,
                dateMiseEnService: dateMiseEnService.toISOString(),
              })),
            },
          })
        )
      }
    )
  }
