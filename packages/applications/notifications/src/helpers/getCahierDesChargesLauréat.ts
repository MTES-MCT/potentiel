import { mediator } from 'mediateur';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

export const getCahierDesChargesLauréat = async (
  identifiantProjet: IdentifiantProjet.ValueType,
) => {
  const cahierDesCharges = await mediator.send<Lauréat.ConsulterCahierDesChargesQuery>({
    type: 'Lauréat.CahierDesCharges.Query.ConsulterCahierDesCharges',
    data: {
      identifiantProjetValue: identifiantProjet.formatter(),
    },
  });
  if (Option.isNone(cahierDesCharges)) {
    throw new Error(`Cahier des charges introuvable`);
  }
  return cahierDesCharges;
};
