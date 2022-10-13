import { EventStore } from '@core/domain'
import { combine, ResultAsync } from '@core/utils'
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
        const result = données.reduce(
          (prev, { identifiantGestionnaireRéseau, dateMiseEnService }) => {
            const projetId = résultats[identifiantGestionnaireRéseau][0].id

            const result = renseignerDateMiseEnService({ projetId, dateMiseEnService })

            return [...prev, result]
          },
          []
        )

        return combine(result)
      })
      .andThen(() =>
        publishToEventStore(
          new MiseAJourDateMiseEnServiceTerminée({
            payload: {
              gestionnaire,
            },
          })
        )
      )
  }
