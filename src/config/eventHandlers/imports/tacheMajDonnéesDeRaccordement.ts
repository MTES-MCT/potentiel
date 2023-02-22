import { tacheImportEventSubscriber } from './importsEventSubscriber';
import {
  makeOnTâcheMiseAJourDonnéesDeRaccordementDémarrée,
  TâcheMiseAJourDonnéesDeRaccordementDémarrée,
} from '@modules/imports/donnéesRaccordement';
import { mettreAJourDonnéesDeRaccordement } from '../../useCases.config';

const onTâcheMiseAJourDonnéesDeRaccordementDémarrée =
  makeOnTâcheMiseAJourDonnéesDeRaccordementDémarrée({
    mettreAJourDonnéesDeRaccordement,
  });

tacheImportEventSubscriber(
  TâcheMiseAJourDonnéesDeRaccordementDémarrée,
  onTâcheMiseAJourDonnéesDeRaccordementDémarrée,
);
