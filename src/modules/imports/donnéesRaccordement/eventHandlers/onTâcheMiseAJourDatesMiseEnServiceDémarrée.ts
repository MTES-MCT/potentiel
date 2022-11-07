import { ResultAsync } from '@core/utils'
import { InfraNotAvailableError } from '@modules/shared'

import { TâcheMiseAJourDatesMiseEnServiceDémarrée } from '../events'

type OnTâcheMiseAJourDatesMiseEnServiceDémarrée = (
  évènement: TâcheMiseAJourDatesMiseEnServiceDémarrée
) => ResultAsync<null, InfraNotAvailableError>

type MakeOnTâcheMiseAJourDatesMiseEnServiceDémarrée = (dépendances: {
  mettreAJourDatesMiseEnService
}) => OnTâcheMiseAJourDatesMiseEnServiceDémarrée

export const makeOnTâcheMiseAJourDatesMiseEnServiceDémarrée: MakeOnTâcheMiseAJourDatesMiseEnServiceDémarrée =

    ({ mettreAJourDatesMiseEnService }) =>
    ({ payload: { gestionnaire, dates } }: TâcheMiseAJourDatesMiseEnServiceDémarrée) => {
      return mettreAJourDatesMiseEnService({
        gestionnaire,
        données: dates.map(({ identifiantGestionnaireRéseau, dateMiseEnService }) => ({
          identifiantGestionnaireRéseau,
          dateMiseEnService: new Date(dateMiseEnService),
        })),
      })
    }
