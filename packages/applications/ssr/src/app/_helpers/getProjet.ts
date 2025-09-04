import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { Candidature, Lauréat, StatutProjet, Éliminé } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';

export type GetProjetReadModel = {
  nomProjet: string;
  localité: Candidature.Localité.ValueType;
  notifiéLe: Option.Type<DateTime.ValueType>;
  statut: StatutProjet.ValueType;
};

export type GetProjet = (identifiantProjet: string) => Promise<GetProjetReadModel>;

export const getProjet: GetProjet = cache(async (identifiantProjet: string) => {
  const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
    type: 'Lauréat.Query.ConsulterLauréat',
    data: {
      identifiantProjet,
    },
  });
  if (Option.isSome(lauréat)) {
    return lauréat;
  }

  const éliminé = await mediator.send<Éliminé.ConsulterÉliminéQuery>({
    type: 'Éliminé.Query.ConsulterÉliminé',
    data: {
      identifiantProjet,
    },
  });
  if (Option.isSome(éliminé)) {
    return éliminé;
  }

  notFound();
});
