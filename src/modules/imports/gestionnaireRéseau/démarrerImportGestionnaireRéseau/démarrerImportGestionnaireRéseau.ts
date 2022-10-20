import { formatTaskId } from '../TâcheId'
import { EventStore, TransactionalRepository } from '@core/domain'
import { User } from '@entities'
import { UnauthorizedError } from '@modules/shared'
import { userIsNot } from '@modules/users'
import { errAsync } from '@core/utils'
import { ImportGestionnaireRéseau } from '../ImportGestionnaireRéseau'
import ImportGestionnaireRéseauId from '../ImportGestionnaireRéseauId'
import { TâcheMiseAJourDatesMiseEnServiceDémarrée } from '../events'
import { DémarrageImpossibleError } from './DémarrageImpossibleError'
import { DonnéesDeMiseAJourObligatoiresError } from './DonnéesDeMiseAJourObligatoiresError'

type MakeDémarrerImportGestionnaireRéseauDépendances = {
  importRepo: TransactionalRepository<ImportGestionnaireRéseau>
  publishToEventStore: EventStore['publish']
}

export type DémarrerImportGestionnaireRéseauCommande = {
  utilisateur: User
  gestionnaire: 'Enedis'
  données: Array<{ identifiantGestionnaireRéseau: string; dateMiseEnService: Date }>
}

export const makeDémarrerImportGestionnaireRéseau =
  ({ importRepo, publishToEventStore }: MakeDémarrerImportGestionnaireRéseauDépendances) =>
  (commande: DémarrerImportGestionnaireRéseauCommande) => {
    const { utilisateur, gestionnaire, données } = commande

    if (userIsNot(['admin', 'dgec-validateur'])(utilisateur)) {
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
          new TâcheMiseAJourDatesMiseEnServiceDémarrée({
            payload: {
              tâcheId: formatTaskId({
                date: importGestionnaireRéseau.dateDeDébut,
                type: 'maj-date-mise-en-service',
              }).toString(),
              misAJourPar: utilisateur.id,
              gestionnaire,
              dates: données.map(({ identifiantGestionnaireRéseau, dateMiseEnService }) => ({
                identifiantGestionnaireRéseau,
                dateMiseEnService: dateMiseEnService.toISOString(),
              })),
            },
          })
        )
      }
    )
  }
