import { ResultAsync } from '@core/utils'
import { InfraNotAvailableError } from '@modules/shared'

import { TâcheMiseAJourDonnéesDeRaccordementDémarrée } from '../events'

type OnTâcheMiseAJourDonnéesDeRaccordementDémarrée = (
  évènement: TâcheMiseAJourDonnéesDeRaccordementDémarrée
) => ResultAsync<null, InfraNotAvailableError>

type MakeOnTâcheMiseAJourDonnéesDeRaccordementDémarrée = (dépendances: {
  mettreAJourDonnéesDeRaccordement
}) => OnTâcheMiseAJourDonnéesDeRaccordementDémarrée

export const makeOnTâcheMiseAJourDonnéesDeRaccordementDémarrée: MakeOnTâcheMiseAJourDonnéesDeRaccordementDémarrée =

    ({ mettreAJourDonnéesDeRaccordement }) =>
    ({ payload: { gestionnaire, dates } }: TâcheMiseAJourDonnéesDeRaccordementDémarrée) => {
      return mettreAJourDonnéesDeRaccordement({
        gestionnaire,
        données: dates.map(({ identifiantGestionnaireRéseau, dateMiseEnService }) => ({
          identifiantGestionnaireRéseau,
          dateMiseEnService: new Date(dateMiseEnService),
        })),
      })
    }
