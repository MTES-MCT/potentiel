import { mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Raccordement as RaccordementLauréat } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';

import { Role } from '@potentiel-domain/utilisateur';
import { Raccordement } from '@potentiel-domain/projet';

import { checkLauréatNonAbandonné } from './checkLauréatNonAbandonné';
import { Routes } from '@potentiel-applications/routes';
import { mapToPlainObject, PlainType } from '@potentiel-domain/core';

type GetRaccordementProps = {
  role: Role.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
};

export type GetRaccordementForProjectPage = {
  raccordement: Option.Type<PlainType<RaccordementLauréat.ConsulterRaccordementReadModel>>;
  affichage?: {
    label: string;
    url?: string;
  };
};

export const getRaccordement = async ({
  role,
  identifiantProjet,
}: GetRaccordementProps): Promise<GetRaccordementForProjectPage> => {
  if (!role.aLaPermission('raccordement.consulter')) {
    return {
      raccordement: Option.none,
    };
  }

  const raccordement = await mediator.send<RaccordementLauréat.ConsulterRaccordementQuery>({
    type: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
    data: { identifiantProjetValue: identifiantProjet.formatter() },
  });

  if (
    Option.isNone(raccordement) ||
    raccordement.dossiers.length === 0 ||
    raccordement.dossiers[0].référence.estÉgaleÀ(
      Raccordement.RéférenceDossierRaccordement.référenceNonTransmise,
    )
  ) {
    const estClasséNonAbandonné = await checkLauréatNonAbandonné(identifiantProjet.formatter());

    return {
      raccordement: Option.none,
      affichage: estClasséNonAbandonné
        ? {
            label: 'Renseigner les données de raccordement',
            url: Routes.Raccordement.détail(identifiantProjet.formatter()),
          }
        : { label: 'Aucun raccordement pour ce projet' },
    };
  }

  return {
    raccordement: mapToPlainObject(raccordement),
    affichage: {
      label: role.aLaPermission('raccordement.gestionnaire.modifier')
        ? 'Consulter ou modifier les documents'
        : 'Consulter les documents',
      url: Routes.Raccordement.détail(identifiantProjet.formatter()),
    },
  };
};
