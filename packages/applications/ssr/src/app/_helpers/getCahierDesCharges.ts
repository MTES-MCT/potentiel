import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

export const getCahierDesCharges = async (identifiantProjet: string) => {
  const cahierDesCharges = await mediator.send<Lauréat.ConsulterCahierDesChargesChoisiQuery>({
    type: 'Lauréat.CahierDesCharges.Query.ConsulterCahierDesChargesChoisi',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(cahierDesCharges)) {
    return notFound();
  }
  return cahierDesCharges;
};
