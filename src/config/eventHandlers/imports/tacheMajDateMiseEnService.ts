import { tacheImportEventSubscriber } from './importsEventSubscriber'
import {
  makeOnTâcheMiseAJourDonnéesDeRaccordementDémarrée,
  TâcheMiseAJourDonnéesDeRaccordementDémarrée,
} from '@modules/imports/donnéesRaccordement'
import { mettreAJourDatesMiseEnService } from '../../useCases.config'

const onTâcheMiseAJourDonnéesDeRaccordementDémarrée =
  makeOnTâcheMiseAJourDonnéesDeRaccordementDémarrée({
    mettreAJourDatesMiseEnService,
  })

tacheImportEventSubscriber(
  TâcheMiseAJourDonnéesDeRaccordementDémarrée,
  onTâcheMiseAJourDonnéesDeRaccordementDémarrée
)
