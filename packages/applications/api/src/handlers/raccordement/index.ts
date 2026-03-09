import { Raccordement } from '@potentiel-applications/api-documentation';

import { listerHandler } from './lister.handler.js';
import { transmettreDateMiseEnServiceHandler } from './transmettreMiseEnService.handler.js';
import { modifierDemandeComplèteHandler } from './modifierDemandeComplète.handler.js';
import { listerManquantsHandler } from './listerManquants.handler.js';
import { transmettreDemandeComplèteHandler } from './transmettreDemandeComplète.handler.js';
import { modifierDateMiseEnServiceHandler } from './modifierMiseEnService.handler.js';

export const raccordementHandlers: Raccordement = {
  lister: listerHandler,
  listerManquants: listerManquantsHandler,
  transmettreDemandeComplète: transmettreDemandeComplèteHandler,
  modifierDemandeComplète: modifierDemandeComplèteHandler,
  transmettreMiseEnService: transmettreDateMiseEnServiceHandler,
  modifierMiseEnService: modifierDateMiseEnServiceHandler,
};
