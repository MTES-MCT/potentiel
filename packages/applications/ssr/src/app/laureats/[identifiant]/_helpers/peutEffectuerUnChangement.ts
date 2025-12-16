import { mediator } from 'mediateur';
import { cache } from 'react';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

/**
 * Le projet n'est pas abandonné, en cours d'abandon, ou achevé
 */
export const peutEffectuerUnChangement = cache(
  async (identifiantProjet: IdentifiantProjet.ValueType) => {
    const abandon = await mediator.send<Lauréat.Abandon.ConsulterAbandonQuery>({
      type: 'Lauréat.Abandon.Query.ConsulterAbandon',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
      },
    });

    if (Option.isSome(abandon) && (abandon.demandeEnCours || abandon.estAbandonné)) {
      return false;
    }

    const achèvement = await mediator.send<Lauréat.Achèvement.ConsulterAchèvementQuery>({
      type: 'Lauréat.Achèvement.Query.ConsulterAchèvement',
      data: { identifiantProjetValue: identifiantProjet.formatter() },
    });

    if (Option.isSome(achèvement) && achèvement.estAchevé) {
      return false;
    }

    return true;
  },
);
