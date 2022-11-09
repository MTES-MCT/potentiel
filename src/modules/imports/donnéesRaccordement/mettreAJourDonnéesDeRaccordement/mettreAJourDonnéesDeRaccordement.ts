import { EventStore } from '@core/domain'
import { ResultAsync } from '@core/utils'
import { TâcheMiseAJourDonnéesDeRaccordementTerminée } from '../events'
import { InfraNotAvailableError } from '@modules/shared'
import { GetProjetsParIdentifiantGestionnaireRéseau } from './GetProjetsParIdentifiantGestionnaireRéseau'
import {
  DateMiseEnServicePlusRécenteError,
  RenseignerDonnéesDeRaccordement,
} from '@modules/project'

type Dépendances = {
  getProjetsParIdentifiantGestionnaireRéseau: GetProjetsParIdentifiantGestionnaireRéseau
  renseignerDonnéesDeRaccordement: RenseignerDonnéesDeRaccordement
  publishToEventStore: EventStore['publish']
}

type Commande = {
  gestionnaire: string
  données: Array<{
    identifiantGestionnaireRéseau: string
    dateMiseEnService: Date
    dateFileAttente?: Date
  }>
}

export type MettreAJourDonnéesDeRaccordement = ReturnType<
  typeof makeMettreAJourDonnéesDeRaccordement
>

export const makeMettreAJourDonnéesDeRaccordement =
  ({
    getProjetsParIdentifiantGestionnaireRéseau,
    renseignerDonnéesDeRaccordement,
    publishToEventStore,
  }: Dépendances) =>
  ({ gestionnaire, données }: Commande) => {
    const lancementDesMiseAJourPourChaqueProjet = (
      projetsParIdentifiantGestionnaireRéseau: Record<string, Array<{ id: string }>>
    ) => {
      return ResultAsync.fromPromise(
        Promise.all(
          données.map(
            async ({ identifiantGestionnaireRéseau, dateMiseEnService, dateFileAttente }) => {
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

              const result = await renseignerDonnéesDeRaccordement({
                projetId,
                dateMiseEnService,
                dateFileAttente,
              })

              return {
                identifiantGestionnaireRéseau,
                projetId,
                ...(result.isOk()
                  ? {
                      état: 'succès' as const,
                    }
                  : {
                      état:
                        result.error instanceof DateMiseEnServicePlusRécenteError
                          ? ('ignoré' as const)
                          : ('échec' as const),
                      raison: result.error.message,
                    }),
              }
            }
          )
        ),
        () => new InfraNotAvailableError()
      )
    }

    const terminerLaMiseAJour = (
      résultat: TâcheMiseAJourDonnéesDeRaccordementTerminée['payload']['résultat']
    ) => {
      return publishToEventStore(
        new TâcheMiseAJourDonnéesDeRaccordementTerminée({
          payload: {
            gestionnaire,
            résultat,
          },
        })
      )
    }

    const identifiantsGestionnaireRéseau = données.map((d) => d.identifiantGestionnaireRéseau)

    return getProjetsParIdentifiantGestionnaireRéseau(identifiantsGestionnaireRéseau)
      .andThen(lancementDesMiseAJourPourChaqueProjet)
      .andThen(terminerLaMiseAJour)
  }
