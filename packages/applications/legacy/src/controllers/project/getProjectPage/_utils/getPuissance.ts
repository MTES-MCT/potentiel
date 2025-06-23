import { Lauréat } from '@potentiel-domain/projet';

import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { checkAbandonAndAchèvement } from './checkAbandonAndAchèvement';
import { mediator } from 'mediateur';

export type GetPuissanceForProjectPage = {
  puissance: number;
  affichage?: {
    labelActions?: string;
    label: string;
    url: string;
  };
};

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: string;
};

export const getPuissance = async ({
  identifiantProjet,
  rôle,
}: Props): Promise<GetPuissanceForProjectPage | undefined> => {
  try {
    const role = Role.convertirEnValueType(rôle);

    const puissanceProjection = await mediator.send<Lauréat.Puissance.ConsulterPuissanceQuery>({
      type: 'Lauréat.Puissance.Query.ConsulterPuissance',
      data: { identifiantProjet: identifiantProjet.formatter() },
    });

    const { aUnAbandonEnCours, estAbandonné, estAchevé } = await checkAbandonAndAchèvement(
      identifiantProjet,
      rôle,
    );

    if (Option.isSome(puissanceProjection)) {
      const { puissance, dateDemandeEnCours } = puissanceProjection;

      if (dateDemandeEnCours) {
        return {
          puissance,
          affichage: role.aLaPermission('puissance.consulterChangement')
            ? {
                url: Routes.Puissance.changement.détails(
                  identifiantProjet.formatter(),
                  dateDemandeEnCours.formatter(),
                ),
                label: 'Voir la demande de modification',
                labelActions: 'Demande de modification de puissance',
              }
            : undefined,
        };
      }

      if (role.aLaPermission('puissance.modifier')) {
        return {
          puissance,
          affichage: {
            url: Routes.Puissance.modifier(identifiantProjet.formatter()),
            label: 'Modifier',
            labelActions: 'Modifier la puissance',
          },
        };
      }

      if (
        role.aLaPermission('puissance.demanderChangement') &&
        !aUnAbandonEnCours &&
        !estAbandonné &&
        !estAchevé
      ) {
        return {
          puissance: puissance,
          affichage: {
            url: Routes.Puissance.changement.demander(identifiantProjet.formatter()),
            label: 'Changer de puissance',
            labelActions: 'Changer de puissance',
          },
        };
      }

      return {
        puissance,
      };
    }

    return undefined;
  } catch (error) {
    getLogger().error(error);
    return undefined;
  }
};
