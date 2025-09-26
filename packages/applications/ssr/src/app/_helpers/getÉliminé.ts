import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { Candidature, Lauréat, Éliminé } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';

export type GetÉliminéReadModel = {
  nomProjet: string;
  localité: Candidature.Localité.ValueType;
  notifiéLe: Option.Type<DateTime.ValueType>;
  statut: Lauréat.StatutLauréat.RawType | 'éliminé';
};

export type GetÉliminé = (identifiantProjet: string) => Promise<GetÉliminéReadModel>;

export const getÉliminé: GetÉliminé = cache(async (identifiantProjet: string) => {
  const éliminé = await mediator.send<Éliminé.ConsulterÉliminéQuery>({
    type: 'Éliminé.Query.ConsulterÉliminé',
    data: {
      identifiantProjet,
    },
  });
  if (Option.isSome(éliminé)) {
    return { ...éliminé, statut: 'éliminé' };
  }

  notFound();
});
