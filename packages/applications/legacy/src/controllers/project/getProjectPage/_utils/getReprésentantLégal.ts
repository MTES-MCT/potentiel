import { mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { Option } from '@potentiel-libraries/monads';
import { Candidature } from '@potentiel-domain/candidature';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { isDemandeChangementReprésentantLégalEnabled } from '@potentiel-applications/feature-flags';

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
      const featureDemandeChangementReprésentantLégalEnabled =
        isDemandeChangementReprésentantLégalEnabled();

      const demandeChangementExistante = await getChangementReprésentantLégal(identifiantProjet);

      const peutConsulterLaDemandeExistante =
        utilisateur.aLaPermission('représentantLégal.consulter') && demandeChangementExistante;

      const peutFaireUneDemande =
        featureDemandeChangementReprésentantLégalEnabled &&
        utilisateur.aLaPermission('représentantLégal.demanderChangement') &&
        !demandeChangementExistante;

      const peutModifier =
        utilisateur.aLaPermission('représentantLégal.modifier') && !demandeChangementExistante;

      return {
        nom: représentantLégal.nomReprésentantLégal,
        modification: peutModifier
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

const getChangementReprésentantLégal = async (identifiantProjet: IdentifiantProjet.ValueType) => {
  if (!isDemandeChangementReprésentantLégalEnabled()) {
    return false;
  }

  try {
    const demande =
      await mediator.send<ReprésentantLégal.ConsulterChangementReprésentantLégalQuery>({
        type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
        data: { identifiantProjet: identifiantProjet.formatter() },
      });

    return Option.match(demande)
      .some(() => true)
      .none(() => false);
  } catch (error) {
    getLogger('getChangementReprésentant').error(
      `Impossible de consulter la demande de changement de représentant légal`,
      {
        identifiantProjet: identifiantProjet.formatter(),
        contexte: 'legacy',
      },
    );
    return false;
  }
};
