import { EventStore } from '@core/domain'
import { combine, ok, ResultAsync } from '@core/utils'
import { MiseAJourDateMiseEnServiceTerminée } from '../events'
import { InfraNotAvailableError } from '@modules/shared'

type MakeMettreAJourDateMiseEnServiceDépendances = {
  getProjetsParIdentifiantGestionnaireRéseau: (
    identifiantGestionnaireRéseau: Array<string>
  ) => ResultAsync<Record<string, Array<{ id: string }>>, InfraNotAvailableError>
  renseignerDateMiseEnService: (commande: {
    projetId: string
    dateMiseEnService: Date
  }) => ResultAsync<null, Error>
  publishToEventStore: EventStore['publish']
}

export type MettreAJourDateMiseEnServiceCommande = {
  gestionnaire: string
  données: Array<{ identifiantGestionnaireRéseau: string; dateMiseEnService: Date }>
}

export const makeMettreAJourDateMiseEnService =
  ({
    getProjetsParIdentifiantGestionnaireRéseau,
    renseignerDateMiseEnService,
    publishToEventStore,
  }: MakeMettreAJourDateMiseEnServiceDépendances) =>
  (commande: MettreAJourDateMiseEnServiceCommande) => {
    const { gestionnaire, données } = commande
    return getProjetsParIdentifiantGestionnaireRéseau(
      données.map((d) => d.identifiantGestionnaireRéseau)
    )
      .andThen((résultats) => {
        const résultat = données.reduce(
          (prev, { identifiantGestionnaireRéseau, dateMiseEnService }) => {
            if (résultats[identifiantGestionnaireRéseau].length > 1) {
              return [
                ...prev,
                ok({
                  identifiantGestionnaireRéseau,
                  état: 'échec' as const,
                  raison: `Plusieurs projets correspondent à l'identifiant gestionnaire de réseau`,
                }),
              ]
            }

            const projetId = résultats[identifiantGestionnaireRéseau][0].id

            renseignerDateMiseEnService({ projetId, dateMiseEnService })
            return [
              ...prev,
              ok({ identifiantGestionnaireRéseau, état: 'succès' as const, projetId }),
            ]
          },
          []
        )

        return combine(résultat)
      })
      .andThen((résultat) =>
        publishToEventStore(
          new MiseAJourDateMiseEnServiceTerminée({
            payload: {
              gestionnaire,
              résultat,
            },
          })
        )
      )
  }
