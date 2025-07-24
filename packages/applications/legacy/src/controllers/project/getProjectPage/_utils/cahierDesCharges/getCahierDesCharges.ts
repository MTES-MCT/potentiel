import { mediator } from 'mediateur';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

// duplicata de packages/applications/ssr/src/app/_helpers
// sera supprimé après la migration de la page projet
export const getCahierDesCharges = async (identifiantProjet: IdentifiantProjet.ValueType) => {
  const cahierDesCharges = await mediator.send<Lauréat.ConsulterCahierDesChargesQuery>({
    type: 'Lauréat.CahierDesCharges.Query.ConsulterCahierDesCharges',
    data: {
      identifiantProjetValue: identifiantProjet.formatter(),
    },
  });

  if (Option.isNone(cahierDesCharges)) {
    return undefined;
  }

  return cahierDesCharges;
};
