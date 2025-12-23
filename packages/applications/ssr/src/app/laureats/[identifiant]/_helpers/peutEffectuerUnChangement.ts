import { cache } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { getAchèvement } from './getAchèvement';
import { getAbandonInfos } from './getLauréat';

/**
 * Le projet n'est pas abandonné, en cours d'abandon, ou achevé
 */
export const peutEffectuerUnChangement = cache(
  async (identifiantProjet: IdentifiantProjet.ValueType) => {
    const abandon = await getAbandonInfos(identifiantProjet.formatter());

    if (abandon?.demandeEnCours || abandon?.estAbandonné) {
      return false;
    }

    const achèvement = await getAchèvement(identifiantProjet.formatter());
    return !achèvement.estAchevé;
  },
);
