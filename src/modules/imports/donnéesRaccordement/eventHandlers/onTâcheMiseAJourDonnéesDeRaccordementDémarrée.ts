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
        données: dates.reduce((donnéesFormatées, ligne) => {
          if ('dateMiseEnService' in ligne && 'dateFileAttente' in ligne) {
            return [
              ...donnéesFormatées,
              {
                identifiantGestionnaireRéseau: ligne.identifiantGestionnaireRéseau,
                dateMiseEnService: new Date(ligne.dateMiseEnService),
                dateFileAttente: new Date(ligne.dateFileAttente),
              },
            ]
          }
          if ('dateMiseEnService' in ligne) {
            return [
              ...donnéesFormatées,
              {
                identifiantGestionnaireRéseau: ligne.identifiantGestionnaireRéseau,
                dateMiseEnService: new Date(ligne.dateMiseEnService),
              },
            ]
          }
          if ('dateFileAttente' in ligne) {
            return [
              ...donnéesFormatées,
              {
                identifiantGestionnaireRéseau: ligne.identifiantGestionnaireRéseau,
                dateFileAttente: new Date(ligne.dateFileAttente),
              },
            ]
          }
          return donnéesFormatées
        }, []),
      })
    }
