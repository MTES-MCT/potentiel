import { mediator } from 'mediateur';
import { Puissance } from '@potentiel-domain/laureat';

import { Option } from '@potentiel-libraries/monads';
import { Candidature } from '@potentiel-domain/candidature';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/common';

export type GetPuissanceForProjectPage = {
  puissance: number;
  affichage?: {
    // label dans la page projet
    label: string;
    // action dans le menu déroulant page projet
    action?: string;
    url: string;
  };
};

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: string;
  demandeNécessiteInstruction: boolean;
};

export const getPuissance = async ({
  identifiantProjet,
  rôle,
}: Props): Promise<GetPuissanceForProjectPage | undefined> => {
  try {
    const role = Role.convertirEnValueType(rôle);

    const puissanceModel = await mediator.send<Puissance.ConsulterPuissanceQuery>({
      type: 'Lauréat.Puissance.Query.ConsulterPuissance',
      data: { identifiantProjet: identifiantProjet.formatter() },
    });

    if (Option.isSome(puissanceModel)) {
      const { puissance } = puissanceModel;

      if (role.aLaPermission('puissance.modifier')) {
        return {
          puissance,
          affichage: {
            url: Routes.Puissance.modifier(identifiantProjet.formatter()),
            label: 'Modifier',
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

    return {
      puissance: '',
    };
  } catch (error) {
    getLogger().error(error);
    return undefined;
  }
};
