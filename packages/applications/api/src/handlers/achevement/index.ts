import { AchevementV1 } from '@potentiel-applications/api-documentation';

import { listerProjetAvecAchevementATransmettreHandler } from './listerProjetAvecAchevementATransmettre.handler.js';
import { transmettreDateAchevementHandler } from './transmettreDateAchevement.handler.js';

export const achevementHandlers: AchevementV1 = {
  listerProjetAvecAchevementATransmettre: listerProjetAvecAchevementATransmettreHandler,
  transmettreDateDAchevement: transmettreDateAchevementHandler,
};
