import ImportGestionnaireRéseauId from '../ImportGestionnaireRéseauId'
import { formatTaskId } from '../TâcheId'
import { EventStore, TransactionalRepository } from '@core/domain'
import { ResultAsync } from '@core/utils'
import { TâcheMiseAJourDatesMiseEnServiceTerminée } from '../events'
import { InfraNotAvailableError } from '@modules/shared'
import { GetProjetsParIdentifiantGestionnaireRéseau } from './GetProjetsParIdentifiantGestionnaireRéseau'
import { ImportGestionnaireRéseau } from '../ImportGestionnaireRéseau'

type Dépendances = {
  getProjetsParIdentifiantGestionnaireRéseau: GetProjetsParIdentifiantGestionnaireRéseau
  renseignerDateMiseEnService: (commande: {
    projetId: string
    dateMiseEnService: Date
  }) => ResultAsync<null, Error>
  publishToEventStore: EventStore['publish']
  importRepo: TransactionalRepository<ImportGestionnaireRéseau>
}

type Commande = {
  gestionnaire: string
  données: Array<{ identifiantGestionnaireRéseau: string; dateMiseEnService: Date }>
}

export const makeMettreAJourDateMiseEnService =
  ({
    getProjetsParIdentifiantGestionnaireRéseau,
    renseignerDateMiseEnService,
    publishToEventStore,
    importRepo,
  }: Dépendances) =>
  ({ gestionnaire, données }: Commande) => {
    const lancementDesMiseAJourPourChaqueProjet = (
      projetsParIdentifiantGestionnaireRéseau: Record<string, Array<{ id: string }>>
    ) => {
      return ResultAsync.fromPromise(
        Promise.all(
          données.map(async ({ identifiantGestionnaireRéseau, dateMiseEnService }) => {
            const nombreDeProjetsCorrespondant =
              projetsParIdentifiantGestionnaireRéseau[identifiantGestionnaireRéseau].length
            if (nombreDeProjetsCorrespondant !== 1) {
              return {
                identifiantGestionnaireRéseau,
                état: 'échec' as const,
                raison:
                  nombreDeProjetsCorrespondant > 1
                    ? `Plusieurs projets correspondent à l'identifiant gestionnaire de réseau`
                    : `Aucun projet ne correspond à l'identifiant gestionnaire de réseau`,
              }
            }

            const projetId =
              projetsParIdentifiantGestionnaireRéseau[identifiantGestionnaireRéseau][0].id

            const result = await renseignerDateMiseEnService({ projetId, dateMiseEnService })

            return {
              identifiantGestionnaireRéseau,
              projetId,
              ...(result.isOk()
                ? {
                    état: 'succès' as const,
                  }
                : {
                    état: 'échec' as const,
                    raison: result.error.message,
                  }),
            }
          })
        ),
        () => new InfraNotAvailableError()
      )
    }

    const terminerLaMiseAJour = (miseAJour) => {
      return importRepo.transaction(
        ImportGestionnaireRéseauId.format(gestionnaire),
        (importGestionnaireRéseau) => {
          return publishToEventStore(
            new TâcheMiseAJourDatesMiseEnServiceTerminée({
              payload: {
                tâcheId: formatTaskId({
                  date: importGestionnaireRéseau.dateDeDébut,
                  type: 'maj-date-mise-en-service',
                }).toString(),
                gestionnaire,
                résultat: miseAJour,
              },
            })
          )
        }
      )
    }

    const identifiantsGestionnaireRéseau = données.map((d) => d.identifiantGestionnaireRéseau)

    return getProjetsParIdentifiantGestionnaireRéseau(identifiantsGestionnaireRéseau)
      .andThen(lancementDesMiseAJourPourChaqueProjet)
      .andThen(terminerLaMiseAJour)
  }
