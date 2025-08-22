import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import type { DateTime } from '@potentiel-domain/common';
import type { DocumentProjet } from '@potentiel-domain/document';
import type { Candidature, Lauréat, StatutProjet, Éliminé } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

export type GetProjetReadModel = {
  nomProjet: string;
  localité: Candidature.Localité.ValueType;
  notifiéLe: Option.Type<DateTime.ValueType>;
  statut: StatutProjet.ValueType;
  attestationDésignation?: DocumentProjet.ValueType;
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
