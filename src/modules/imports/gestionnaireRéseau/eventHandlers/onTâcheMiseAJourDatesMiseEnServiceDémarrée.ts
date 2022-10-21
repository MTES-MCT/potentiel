import { ResultAsync } from '@core/utils'
import { InfraNotAvailableError } from '@modules/shared'

import { TâcheMiseAJourDatesMiseEnServiceDémarrée } from '../events'

type OnTâcheMiseAJourDatesMiseEnServiceDémarrée = (
  évènement: TâcheMiseAJourDatesMiseEnServiceDémarrée
) => ResultAsync<null, InfraNotAvailableError>

type MakeOnTâcheMiseAJourDatesMiseEnServiceDémarrée = (dépendances: {
  mettreAJourDateMiseEnService
}) => OnTâcheMiseAJourDatesMiseEnServiceDémarrée

export const makeOnTâcheMiseAJourDatesMiseEnServiceDémarrée: MakeOnTâcheMiseAJourDatesMiseEnServiceDémarrée =

    ({ mettreAJourDateMiseEnService }) =>
    ({ payload: { gestionnaire, dates } }: TâcheMiseAJourDatesMiseEnServiceDémarrée) => {
      return mettreAJourDateMiseEnService({
        gestionnaire,
        données: dates.map(({ identifiantGestionnaireRéseau, dateMiseEnService }) => ({
          identifiantGestionnaireRéseau,
          dateMiseEnService: new Date(dateMiseEnService),
        })),
      })
    }
