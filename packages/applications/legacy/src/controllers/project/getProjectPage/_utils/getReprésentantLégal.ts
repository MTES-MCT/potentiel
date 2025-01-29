import { mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { listProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';
import { Candidature } from '@potentiel-domain/candidature';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { getAbandonStatut } from './getAbandon';
import { getAttestationDeConformité } from './getAttestationDeConformité';

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

    const demandeEnCours =
      await mediator.send<ReprésentantLégal.ConsulterChangementReprésentantLégalEnCoursQuery>({
        type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégalEnCours',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

    const demandeChangementExistante =
      utilisateur.aLaPermission('représentantLégal.consulterChangement') &&
      Option.isSome(demandeEnCours);

    const statutAbandon = await getAbandonStatut(identifiantProjet);
    const abandonAccordé = statutAbandon?.statut === 'accordé';
    const abandonEnCours = !!(
      statutAbandon?.statut &&
      ['demandé', 'confirmé', 'confirmation-demandée'].includes(statutAbandon.statut)
    );

    const attestationConformitéExistante = !!(await getAttestationDeConformité(
      identifiantProjet,
      rôle,
    ));

    const peutConsulterLaDemandeExistante = demandeChangementExistante && !abandonAccordé;

    const peutFaireUneDemande =
      utilisateur.aLaPermission('représentantLégal.demanderChangement') &&
      !demandeChangementExistante &&
      !abandonAccordé &&
      !abandonEnCours &&
      !attestationConformitéExistante;

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
