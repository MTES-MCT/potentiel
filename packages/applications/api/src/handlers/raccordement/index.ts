import { Raccordement } from '@potentiel-applications/api-documentation';

import { listerHandler } from './lister.handler.js';

export const raccordementHandlers: Raccordement = {
  lister: listerHandler,
};
