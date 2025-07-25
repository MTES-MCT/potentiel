import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

export const checkLauréatNonAbandonné = async (
  identifiantProjet: IdentifiantProjet.RawType,
): Promise<boolean> => {
  const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
    type: 'Lauréat.Query.ConsulterLauréat',
    data: {
      identifiantProjet,
    },
  });

  const abandon = await mediator.send<Lauréat.Abandon.ConsulterAbandonQuery>({
    type: 'Lauréat.Abandon.Query.ConsulterAbandon',
    data: { identifiantProjetValue: identifiantProjet },
  });

  return Option.isSome(lauréat) && (Option.isNone(abandon) || !abandon.statut.estAccordé());
};
