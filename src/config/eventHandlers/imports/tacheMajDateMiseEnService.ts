import { tacheImportEventSubscriber } from './importsEventSubscriber'
import {
  TâcheMiseAJourDatesMiseEnServiceDémarrée,
  makeMettreAJourDateMiseEnService,
} from '@modules/imports/gestionnaireRéseau'
import { getProjetsParIdentifiantGestionnaireRéseau } from '../../queries.config'
import { eventStore } from '../../eventStore.config'
import { renseignerDateMiseEnService } from '../../useCases.config'

const publishToEventStore = eventStore.publish.bind(eventStore)

const mettreAJourDateMiseEnService = makeMettreAJourDateMiseEnService({
  getProjetsParIdentifiantGestionnaireRéseau,
  publishToEventStore,
  renseignerDateMiseEnService,
})

tacheImportEventSubscriber(
  TâcheMiseAJourDatesMiseEnServiceDémarrée,
  (event: TâcheMiseAJourDatesMiseEnServiceDémarrée) => {
    const {
      payload: { gestionnaire, dates },
    } = event

    return mettreAJourDateMiseEnService({
      gestionnaire,
      données: dates.map(({ identifiantGestionnaireRéseau, dateMiseEnService }) => ({
        identifiantGestionnaireRéseau,
        dateMiseEnService: new Date(dateMiseEnService),
      })),
    })
  }
)
