import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { mapToPlainObject, PlainType } from '@potentiel-domain/core';

import { getAction } from '../../../_helpers/getAction';
import { ChampObligatoireAvecAction } from '../../../_helpers/types';

export type GetÉvaluationCarboneForProjectPage = {
  évaluationCarboneSimplifiée: ChampObligatoireAvecAction<number>;
  fournisseurs: ChampObligatoireAvecAction<
    PlainType<Array<Lauréat.Fournisseur.Fournisseur.ValueType>>
  >;
};

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: Role.ValueType;
};

export const getÉvaluationCarbone = async ({
  identifiantProjet,
  rôle,
}: Props): Promise<GetÉvaluationCarboneForProjectPage> => {
  const projection = await mediator.send<Lauréat.Fournisseur.ConsulterFournisseurQuery>({
    type: 'Lauréat.Fournisseur.Query.ConsulterFournisseur',
    data: { identifiantProjet: identifiantProjet.formatter() },
  });

  if (Option.isNone(projection)) {
    return notFound();
  }

  const { fournisseurs, évaluationCarboneSimplifiée } = projection;

  const actionFournisseur = await getAction({
    identifiantProjet,
    rôle,
    domain: 'fournisseur',
  });

  return {
    fournisseurs: { value: mapToPlainObject(fournisseurs), action: actionFournisseur },
    évaluationCarboneSimplifiée: { value: évaluationCarboneSimplifiée },
  };
};
