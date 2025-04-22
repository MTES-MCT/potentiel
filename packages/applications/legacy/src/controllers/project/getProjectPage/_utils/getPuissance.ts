import { Puissance } from '@potentiel-domain/laureat';

import { Option } from '@potentiel-libraries/monads';
import { Candidature } from '@potentiel-domain/candidature';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { checkAbandonAndAchèvement } from './checkAbandonAndAchèvement';
import { mediator } from 'mediateur';

export type GetPuissanceForProjectPage = {
  puissance: number;
  affichage?: {
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

    const puissanceProjection = await mediator.send<Puissance.ConsulterPuissanceQuery>({
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
          },
        };
      }

      return {
        puissance,
      };
    }

    const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });

    if (Option.isSome(candidature)) {
      return {
        puissance: candidature.puissanceProductionAnnuelle,
        affichage: role.aLaPermission('candidature.corriger')
          ? {
              url: Routes.Candidature.corriger(identifiantProjet.formatter()),
              label: 'Modifier la candidature',
            }
          : undefined,
      };
    }

    return undefined;
  } catch (error) {
    getLogger().error(error);
    return undefined;
  }
};
