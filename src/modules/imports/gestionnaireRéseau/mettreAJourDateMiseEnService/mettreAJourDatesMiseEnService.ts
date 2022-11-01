import { EventStore } from '@core/domain'
import { ResultAsync } from '@core/utils'
import { RésultatTâcheMaJMeS, TâcheMiseAJourDatesMiseEnServiceTerminée } from '../events'
import { InfraNotAvailableError } from '@modules/shared'
import { GetProjetsParIdentifiantGestionnaireRéseau } from './GetProjetsParIdentifiantGestionnaireRéseau'
import { DateMiseEnServicePlusRécenteError, RenseignerDateMiseEnService } from '@modules/project'

type Dépendances = {
  getProjetsParIdentifiantGestionnaireRéseau: GetProjetsParIdentifiantGestionnaireRéseau
  renseignerDateMiseEnService: RenseignerDateMiseEnService
  publishToEventStore: EventStore['publish']
}

type Commande = {
  gestionnaire: string
  données: Array<{ identifiantGestionnaireRéseau: string; dateMiseEnService: Date }>
}

export const makeMettreAJourDatesMiseEnService =
  ({
    getProjetsParIdentifiantGestionnaireRéseau,
    renseignerDateMiseEnService,
    publishToEventStore,
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
              ...(result.isOk() || result.error instanceof DateMiseEnServicePlusRécenteError
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

    const terminerLaMiseAJour = (miseAJour: RésultatTâcheMaJMeS) => {
      return publishToEventStore(
        new TâcheMiseAJourDatesMiseEnServiceTerminée({
          payload: {
            gestionnaire,
            résultat: miseAJour,
          },
        })
      )
    }

    const identifiantsGestionnaireRéseau = données.map((d) => d.identifiantGestionnaireRéseau)

    return getProjetsParIdentifiantGestionnaireRéseau(identifiantsGestionnaireRéseau)
      .andThen(lancementDesMiseAJourPourChaqueProjet)
      .andThen(terminerLaMiseAJour)
  }
