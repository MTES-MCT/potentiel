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
      demandeDeModification?: {
        peutConsulterLaDemandeExistante: boolean;
        peutFaireUneDemande: boolean;
      };
    }
  | undefined;

type GetReprésentantLégal = (
  identifiantProjet: IdentifiantProjet.ValueType,
  role: string,
) => Promise<GetReprésentantLégalForProjectPage>;

export const getReprésentantLégal: GetReprésentantLégal = async (identifiantProjet, rôle) => {
  try {
    const utilisateur = Role.convertirEnValueType(rôle);

    const représentantLégal =
      await mediator.send<ReprésentantLégal.ConsulterReprésentantLégalQuery>({
        type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
        data: { identifiantProjet: identifiantProjet.formatter() },
      });

    if (Option.isSome(représentantLégal)) {
      const demandeChangementExistante =
        await getDemandeChangementReprésentantLégal(identifiantProjet);

      const peutConsulterLaDemandeExistante =
        demandeChangementExistante && utilisateur.aLaPermission('représentantLégal.consulter');

      const peutFaireUneDemande =
        !demandeChangementExistante &&
        utilisateur.aLaPermission('représentantLégal.demanderChangement');

      const peutFaireModification =
        !demandeChangementExistante && utilisateur.aLaPermission('représentantLégal.modifier');

      return {
        nom: représentantLégal.nomReprésentantLégal,
        modification: peutFaireModification
          ? {
              type: 'lauréat',
              url: Routes.ReprésentantLégal.modifier(identifiantProjet.formatter()),
            }
          : undefined,
        demandeDeModification: {
          peutConsulterLaDemandeExistante,
          peutFaireUneDemande,
        },
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

const getDemandeChangementReprésentantLégal = async (
  identifiantProjet: IdentifiantProjet.ValueType,
) => {
  const demande = await mediator.send<ReprésentantLégal.ReprésentantLégalQuery>({
    type: 'Lauréat.ReprésentantLégal.Query.ConsulterDemandeChangementReprésentantLégal',
    data: { identifiantProjet: identifiantProjet.formatter() },
  });

  return Option.match(demande)
    .some(() => true)
    .none(() => false);
};
