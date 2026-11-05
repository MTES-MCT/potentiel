import type { AchevementV1, AchevementV2 } from '@potentiel-applications/api-documentation';

import { NotImplementedError } from '../../errors.js';
import { listerProjetAvecAchevementATransmettreHandler } from './listerProjetAvecAchevementATransmettre.handler.js';
import { transmettreDateAchevementHandler } from './transmettreDateAchevement.handler.js';

export const achevementV1Handlers: AchevementV1 = {
  listerProjetAvecAchevementATransmettre: listerProjetAvecAchevementATransmettreHandler,
  transmettreDateDAchevement: transmettreDateAchevementHandler,
};

export const achevementV2Handlers: AchevementV2 = {
  listerProjetsEnAttenteDAchevement: () => {
    throw new NotImplementedError();
  },
  récupérerProjet: () => {
    throw new NotImplementedError();
  },
};
