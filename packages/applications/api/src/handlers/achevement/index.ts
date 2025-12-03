import { AchevementV1 } from '@potentiel-applications/api-documentation';

import { listerAchevementEnAttenteHandler } from './listerAchevementEnAttente.handler.js';

export const achevementHandlers: AchevementV1 = {
  listerEnAttente: listerAchevementEnAttenteHandler,
};
