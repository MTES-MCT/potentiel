import { Raccordement } from '@potentiel-applications/api-documentation';

import { listerHandler } from './lister.handler.js';
import { transmettreDateMiseEnServiceHandler } from './transmettreDateMiseEnService.handler.js';

export const raccordementHandlers: Raccordement = {
  lister: listerHandler,
  transmettreDateMiseEnService: transmettreDateMiseEnServiceHandler,
};
