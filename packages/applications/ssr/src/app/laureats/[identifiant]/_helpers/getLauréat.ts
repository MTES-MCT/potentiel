import { mediator } from 'mediateur';
import { cache } from 'react';
import { notFound } from 'next/navigation';

import { Candidature } from '@potentiel-domain/candidature';
import { Option } from '@potentiel-libraries/monads';
import { Actionnaire } from '@potentiel-domain/laureat';

type Props = {
  identifiantProjet: string;
  sociétéMère: Candidature.ConsulterCandidatureReadModel['sociétéMère'];
};

// TODO: après le POC, ajouter représentant légal, puissance
type LauréatFields = 'actionnaire';

export type GetLauréat = Record<LauréatFields, { currentValue: string; AÉtéModifié: boolean }>;

export const getLauréat = cache(
  async ({ identifiantProjet, sociétéMère }: Props): Promise<GetLauréat> => {
    const actionnaireInfos = await getActionnaireInfos({ identifiantProjet, sociétéMère });

    return {
      actionnaire: actionnaireInfos,
    };
  },
);

const getActionnaireInfos = async ({ identifiantProjet, sociétéMère }: Props) => {
  const actionnaire = await mediator.send<Actionnaire.ConsulterActionnaireQuery>({
    type: 'Lauréat.Actionnaire.Query.ConsulterActionnaire',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(actionnaire)) {
    return notFound();
  }

  const AÉtéModifié = !!(actionnaire.actionnaire !== sociétéMère || actionnaire.dateDemandeEnCours);

  return {
    currentValue: actionnaire.actionnaire,
    AÉtéModifié,
  };
};
