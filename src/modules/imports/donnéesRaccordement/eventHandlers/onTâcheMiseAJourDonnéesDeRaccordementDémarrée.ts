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
      console.log('STEP 2 OK')
      const données = dates.reduce((donnéesFormatées, ligne) => {
        if ('dateMiseEnService' in ligne && 'dateFileAttente' in ligne) {
          return [
            ...donnéesFormatées,
            {
              identifiantGestionnaireRéseau: ligne.identifiantGestionnaireRéseau,
              dateMiseEnService: ligne.dateMiseEnService,
              dateFileAttente: ligne.dateFileAttente,
            },
          ]
        }
        if ('dateMiseEnService' in ligne) {
          return [
            ...donnéesFormatées,
            {
              identifiantGestionnaireRéseau: ligne.identifiantGestionnaireRéseau,
              dateMiseEnService: ligne.dateMiseEnService,
            },
          ]
        }
        if ('dateFileAttente' in ligne) {
          return [
            ...donnéesFormatées,
            {
              identifiantGestionnaireRéseau: ligne.identifiantGestionnaireRéseau,
              dateFileAttente: ligne.dateFileAttente,
            },
          ]
        }
        return donnéesFormatées
      }, [])

      console.log('DONNÉES', données)
      return mettreAJourDonnéesDeRaccordement({
        gestionnaire,
        données,
      })
    }
