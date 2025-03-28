import { mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { Candidature } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { checkAbandonAndAchèvement } from './checkAbandonAndAchèvement';

export type GetReprésentantLégalForProjectPage =
  | {
      nom: string;
      modification?: {
        type: 'lauréat' | 'candidature';
        url: string;
      };
      demandeDeModification?: {
        demandéLe: string;
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

    if (Option.isNone(représentantLégal)) {
      const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
        type: 'Candidature.Query.ConsulterCandidature',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(candidature)) {
        return undefined;
      }

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

    const demandeEnCours = utilisateur.aLaPermission('représentantLégal.consulterChangement')
      ? await mediator.send<ReprésentantLégal.ConsulterChangementReprésentantLégalEnCoursQuery>({
          type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégalEnCours',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        })
      : Option.none;

    const demandeChangementExistante = Option.isSome(demandeEnCours);

    const { aUnAbandonEnCours, estAbandonné, estAchevé } = await checkAbandonAndAchèvement(
      identifiantProjet,
      rôle,
    );

    const peutConsulterLaDemandeExistante = demandeChangementExistante && !estAbandonné;

    const peutFaireUneDemande =
      utilisateur.aLaPermission('représentantLégal.demanderChangement') &&
      !demandeChangementExistante &&
      !aUnAbandonEnCours &&
      !estAbandonné &&
      !estAchevé;

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
        demandéLe: Option.isSome(demandeEnCours) ? demandeEnCours.demandéLe.formatter() : '',
        peutConsulterLaDemandeExistante,
        peutFaireUneDemande,
      },
    };
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
