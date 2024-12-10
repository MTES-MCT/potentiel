import { mediator } from 'mediateur';
import { Actionnaire } from '@potentiel-domain/laureat';

import { Option } from '@potentiel-libraries/monads';
import { Candidature } from '@potentiel-domain/candidature';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';

export type GetActionnaireForProjectPage =
  | {
      nom: string;
      modificationUrl?: string;
    }
  | undefined;

export const getActionnaire = async (
  identifiantProjet,
  rôle,
): Promise<GetActionnaireForProjectPage> => {
  try {
    const utilisateur = Role.convertirEnValueType(rôle);

    const actionnaire = await mediator.send<Actionnaire.ConsulterActionnaireQuery>({
      type: 'Lauréat.Actionnaire.Query.ConsulterActionnaire',
      data: { identifiantProjet: identifiantProjet.formatter() },
    });

    if (Option.isSome(actionnaire)) {
      return {
        nom: actionnaire.actionnaire,
        modificationUrl: utilisateur.aLaPermission('actionnaire.modifier')
          ? Routes.Actionnaire.modifier(identifiantProjet.formatter())
          : undefined,
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
        nom: candidature.sociétéMère,
        modificationUrl: utilisateur.aLaPermission('candidature.corriger')
          ? Routes.Candidature.corriger(identifiantProjet.formatter())
          : undefined,
      };
    }

    return undefined;
  } catch (error) {
    getLogger().error(`Impossible de consulter l'actionnaire'`, {
      identifiantProjet: identifiantProjet.formatter(),
    });
    return undefined;
  }
};
