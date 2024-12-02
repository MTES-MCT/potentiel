import { mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { Option } from '@potentiel-libraries/monads';
import { Candidature } from '@potentiel-domain/candidature';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';

export type GetReprésentantLégalForProjectPage =
  | {
      nom: string;
      modification?: {
        type: 'lauréat' | 'candidature';
        url: string;
      };
      demanderChangement: boolean;
    }
  | undefined;

type GetReprésentantLégal = (
  identifiantProjet: IdentifiantProjet.ValueType,
  role: string,
) => Promise<GetReprésentantLégalForProjectPage>;

export const getReprésentantLégal: GetReprésentantLégal = async (identifiantProjet, rôle) => {
  try {
    const utilisateur = Role.convertirEnValueType(rôle);
    const demanderChangement = utilisateur.aLaPermission('représentantLégal.demanderChangement');

    const représentantLégal = await mediator.send<ReprésentantLégal.ReprésentantLégalQuery>({
      type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
      data: { identifiantProjet: identifiantProjet.formatter() },
    });

    if (Option.isSome(représentantLégal)) {
      return {
        nom: représentantLégal.nomReprésentantLégal,
        modification: utilisateur.aLaPermission('représentantLégal.modifier')
          ? {
              type: 'lauréat',
              url: Routes.ReprésentantLégal.modifier(identifiantProjet.formatter()),
            }
          : undefined,
        demanderChangement,
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
        nom: candidature.nomReprésentantLégal,
        modification: utilisateur.aLaPermission('candidature.corriger')
          ? {
              type: 'candidature',
              url: Routes.Candidature.corriger(identifiantProjet.formatter()),
            }
          : undefined,
        demanderChangement,
      };
    }

    return undefined;
  } catch (error) {
    getLogger('Legacy|getProjectPage|getReprésentantLégal').error(
      `Impossible de consulter le représentant légal`,
      {
        identifiantProjet: identifiantProjet.formatter(),
      },
    );
    return undefined;
  }
};
