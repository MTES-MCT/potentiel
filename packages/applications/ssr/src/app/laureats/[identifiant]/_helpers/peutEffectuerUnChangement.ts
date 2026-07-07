import { cache } from 'react';

import type { IdentifiantProjet } from '@potentiel-domain/projet';

import { getAchèvement } from './getAchèvement';
import { getOptionalAbandon } from './getLauréat';

/**
 * Le projet n'est pas abandonné, en cours d'abandon, ou achevé
 */
export const peutEffectuerUnChangement = cache(
  async (identifiantProjet: IdentifiantProjet.ValueType) => {
    const abandon = await getOptionalAbandon(identifiantProjet.formatter());

    if (abandon?.statut.estEnCours() || abandon?.statut.estAccordé()) {
      return false;
    }

    const achèvement = await getAchèvement(identifiantProjet.formatter());
    return !achèvement.estAchevé;
  },
);
