import { tacheImportEventSubscriber } from './importsEventSubscriber'
import {
  makeOnTâcheMiseAJourDatesMiseEnServiceDémarrée,
  TâcheMiseAJourDatesMiseEnServiceDémarrée,
} from '@modules/imports/gestionnaireRéseau'
import { mettreAJourDateMiseEnService } from '../../useCases.config'

const onTâcheMiseAJourDatesMiseEnServiceDémarrée = makeOnTâcheMiseAJourDatesMiseEnServiceDémarrée({
  mettreAJourDateMiseEnService,
})

tacheImportEventSubscriber(
  TâcheMiseAJourDatesMiseEnServiceDémarrée,
  onTâcheMiseAJourDatesMiseEnServiceDémarrée
)
