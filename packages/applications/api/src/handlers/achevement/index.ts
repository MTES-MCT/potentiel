import type { AchevementV1 } from '@potentiel-applications/api-documentation';

import { NotImplementedError } from '../../errors.js';
import { listerProjetAvecAchevementATransmettreHandler } from './listerProjetAvecAchevementATransmettre.handler.js';
import { transmettreDateAchevementHandler } from './transmettreDateAchevement.handler.js';

export const achevementHandlers: AchevementV1 = {
  listerProjetAvecAchevementATransmettre: listerProjetAvecAchevementATransmettreHandler,
  transmettreDateDAchevement: transmettreDateAchevementHandler,
  listerProjetsEnAttenteDAchevement: () => {
    throw new NotImplementedError();
  },
  récupérerProjet: () => {
    throw new NotImplementedError();
  },
};
