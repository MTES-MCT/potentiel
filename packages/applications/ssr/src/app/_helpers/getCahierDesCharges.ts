import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

export const getCahierDesCharges = async (identifiantProjet: IdentifiantProjet.ValueType) => {
  const cahierDesCharges = await mediator.send<Lauréat.ConsulterCahierDesChargesQuery>({
    type: 'Lauréat.CahierDesCharges.Query.ConsulterCahierDesCharges',
    data: {
      identifiantProjetValue: identifiantProjet.formatter(),
    },
  });

  if (Option.isNone(cahierDesCharges)) {
    return notFound();
  }

  return cahierDesCharges;
};
