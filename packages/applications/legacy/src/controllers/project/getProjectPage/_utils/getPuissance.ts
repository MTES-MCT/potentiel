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
    labelPageProjet: string;
    url: string;
  };
  demandeEnCours?: {
    demandéeLe: string;
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
    const showPuissance = process.env.SHOW_PUISSANCE === 'true';

    if (!showPuissance) {
      return undefined;
    }

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
          demandeEnCours: role.aLaPermission('puissance.consulterChangement')
            ? {
                demandéeLe: dateDemandeEnCours.formatter(),
              }
            : undefined,
        };
      }

      if (role.aLaPermission('puissance.modifier')) {
        return {
          puissance,
          affichage: {
            url: Routes.Puissance.modifier(identifiantProjet.formatter()),
            labelPageProjet: 'Modifier',
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
            labelPageProjet: 'Demander changement de puissance',
          },
        };
      }

      return {
        puissance: puissance,
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
              labelPageProjet: 'Modifier la candidature',
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
