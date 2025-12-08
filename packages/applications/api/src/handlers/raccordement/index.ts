import { Raccordement } from '@potentiel-applications/api-documentation';

import { listerHandler } from './lister.handler.js';
import { transmettreDateMiseEnServiceHandler } from './transmettreDateMiseEnService.handler.js';
import { modifierReferenceHandler } from './modifierReference.handler.js';
import { listerManquantsHandlers } from './listerManquants.js';
import { transmettreDemandeComplèteHandler } from './transmettreDemandeComplète.handler.js';

export const raccordementHandlers: Raccordement = {
  lister: listerHandler,
  transmettreDateMiseEnService: transmettreDateMiseEnServiceHandler,
  modifierReference: modifierReferenceHandler,
  listerManquants: listerManquantsHandlers,
  transmettreDemandeComplète: transmettreDemandeComplèteHandler,
};
