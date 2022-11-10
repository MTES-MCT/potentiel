import { ResultAsync } from '@core/utils'
import { MettreAJourDonnéesDeRaccordement } from '@modules/imports/donnéesRaccordement'
import { InfraNotAvailableError } from '@modules/shared'

import { TâcheMiseAJourDonnéesDeRaccordementDémarrée } from '../events'

type OnTâcheMiseAJourDonnéesDeRaccordementDémarrée = (
  évènement: TâcheMiseAJourDonnéesDeRaccordementDémarrée
) => ResultAsync<null, InfraNotAvailableError>

type MakeOnTâcheMiseAJourDonnéesDeRaccordementDémarrée = (dépendances: {
  mettreAJourDonnéesDeRaccordement: MettreAJourDonnéesDeRaccordement
}) => OnTâcheMiseAJourDonnéesDeRaccordementDémarrée

export const makeOnTâcheMiseAJourDonnéesDeRaccordementDémarrée: MakeOnTâcheMiseAJourDonnéesDeRaccordementDémarrée =

    ({ mettreAJourDonnéesDeRaccordement }) =>
    ({ payload: { gestionnaire, dates } }: TâcheMiseAJourDonnéesDeRaccordementDémarrée) => {
      return mettreAJourDonnéesDeRaccordement({
        gestionnaire,
        données: dates.map(
          ({ identifiantGestionnaireRéseau, dateMiseEnService, dateFileAttente }) => ({
            identifiantGestionnaireRéseau,
            dateMiseEnService: new Date(dateMiseEnService),
            ...(dateFileAttente && { dateFileAttente: new Date(dateFileAttente) }),
          })
        ),
      })
    }
