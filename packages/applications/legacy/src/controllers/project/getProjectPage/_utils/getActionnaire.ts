import { mediator } from 'mediateur';
import { Actionnaire, Lauréat } from '@potentiel-domain/laureat';

import { Option } from '@potentiel-libraries/monads';
import { Candidature } from '@potentiel-domain/candidature';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';

export type GetActionnaireForProjectPage =
  | {
      nom: string;
      modification?: {
        label: string;
        url: string;
      };
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

    // TODO: ajouter ici la condition sur la demande vs la modification (appel offre)
    if (Option.isSome(actionnaire)) {
      return {
        nom: actionnaire.actionnaire,
        modification: utilisateur.aLaPermission('actionnaire.modifier')
          ? {
              url: Routes.Actionnaire.modifier(identifiantProjet.formatter()),
              label: "Modifier l'actionnaire",
            }
          : undefined,
      };
    }

    const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
      type: 'Lauréat.Query.ConsulterLauréat',
      data: { identifiantProjet: identifiantProjet.formatter() },
    });

    if (Option.isSome(lauréat)) {
      return {
        nom: '',
        modification: utilisateur.aLaPermission('actionnaire.transmettre')
          ? {
              url: Routes.Actionnaire.transmettre(identifiantProjet.formatter()),
              label: "Transmettre l'actionnaire",
            }
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
        modification: utilisateur.aLaPermission('candidature.corriger')
          ? {
              url: Routes.Candidature.corriger(identifiantProjet.formatter()),
              label: 'Modifier la candidature',
            }
          : undefined,
      };
    }

    return {
      nom: '',
      modification: undefined,
    };
  } catch (error) {
    getLogger().error(`Impossible de consulter l'actionnaire'`, {
      identifiantProjet: identifiantProjet.formatter(),
    });
    return undefined;
  }
};
