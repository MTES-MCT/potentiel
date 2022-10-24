import { tacheImportEventSubscriber } from './importsEventSubscriber'
import {
  makeOnTâcheMiseAJourDatesMiseEnServiceDémarrée,
  TâcheMiseAJourDatesMiseEnServiceDémarrée,
} from '@modules/imports/gestionnaireRéseau'
import { mettreAJourDatesMiseEnService } from '../../useCases.config'

const onTâcheMiseAJourDatesMiseEnServiceDémarrée = makeOnTâcheMiseAJourDatesMiseEnServiceDémarrée({
  mettreAJourDatesMiseEnService,
})

tacheImportEventSubscriber(
  TâcheMiseAJourDatesMiseEnServiceDémarrée,
  onTâcheMiseAJourDatesMiseEnServiceDémarrée
)
