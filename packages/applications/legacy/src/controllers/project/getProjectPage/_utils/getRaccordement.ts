import { mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { Role } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-applications/routes';
import { mapToPlainObject, PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';
import { checkAbandonAndAchèvement } from './checkLauréat/checkAbandonAndAchèvement';

type GetRaccordementProps = {
  role: Role.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
};

export type GetRaccordementForProjectPage = {
  raccordement: Option.Type<PlainType<Lauréat.Raccordement.ConsulterRaccordementReadModel>>;
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

  const raccordement = await mediator.send<Lauréat.Raccordement.ConsulterRaccordementQuery>({
    type: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
    data: { identifiantProjetValue: identifiantProjet.formatter() },
  });

  if (
    Option.isNone(raccordement) ||
    raccordement.dossiers.length === 0 ||
    raccordement.dossiers[0].référence.estÉgaleÀ(
      Lauréat.Raccordement.RéférenceDossierRaccordement.référenceNonTransmise,
    )
  ) {
    const { aUnAbandonEnCours, estAbandonné } = await checkAbandonAndAchèvement(
      identifiantProjet,
      role.nom,
    );

    return {
      raccordement: Option.none,
      affichage: estAbandonné
        ? {
            label: 'Aucun raccordement pour ce projet',
          }
        : aUnAbandonEnCours
          ? {
              label:
                "Impossible de renseigner ce raccordement car une demande d'abandon est en cours",
            }
          : role.aLaPermission('raccordement.demande-complète-raccordement.transmettre')
            ? {
                label: 'Renseigner les données de raccordement',
                url: Routes.Raccordement.détail(identifiantProjet.formatter()),
              }
            : undefined,
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
