import { mediator } from 'mediateur';
import { Actionnaire } from '@potentiel-domain/laureat';

import { Option } from '@potentiel-libraries/monads';
import { Candidature } from '@potentiel-domain/candidature';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { checkAbandonAndAchèvement } from './checkAbandonAndAchèvement';

export type GetActionnaireForProjectPage = {
  nom: string;
  affichage?: {
    // label dans la page projet
    label: string;
    // action dans le menu déroulant page projet
    action?: string;
    url: string;
  };
  demandeEnCours?: {
    demandéeLe: string;
  };
};

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: string;
  demandeNécessiteInstruction: boolean;
};

export const getActionnaire = async ({
  identifiantProjet,
  rôle,
  demandeNécessiteInstruction,
}: Props): Promise<GetActionnaireForProjectPage | undefined> => {
  try {
    const role = Role.convertirEnValueType(rôle);

    const actionnaire = await mediator.send<Actionnaire.ConsulterActionnaireQuery>({
      type: 'Lauréat.Actionnaire.Query.ConsulterActionnaire',
      data: { identifiantProjet: identifiantProjet.formatter() },
    });

    const estAbandonnéOuAchevé = await checkAbandonAndAchèvement(identifiantProjet, rôle);

    if (Option.isSome(actionnaire)) {
      const { actionnaire: nom, dateDemandeEnCours } = actionnaire;

      if (dateDemandeEnCours) {
        return {
          nom,
          demandeEnCours: role.aLaPermission('actionnaire.consulterChangement')
            ? {
                demandéeLe: dateDemandeEnCours.formatter(),
              }
            : undefined,
        };
      }

      const peutModifier = role.aLaPermission('actionnaire.modifier');
      const peutFaireUneDemandeDeChangement =
        demandeNécessiteInstruction &&
        role.aLaPermission('actionnaire.demanderChangement') &&
        !estAbandonnéOuAchevé;

      const peutEnregistrerChangement =
        !demandeNécessiteInstruction &&
        role.aLaPermission('actionnaire.enregistrerChangement') &&
        !estAbandonnéOuAchevé;

      if (peutModifier) {
        return {
          nom,
          affichage: {
            url: Routes.Actionnaire.modifier(identifiantProjet.formatter()),
            label: 'Modifier',
          },
        };
      }

      if (peutEnregistrerChangement) {
        return {
          nom,
          affichage: {
            url: Routes.Actionnaire.changement.enregistrer(identifiantProjet.formatter()),
            label: 'Faire un changement',
            action: "Changer d'actionnaire(s)",
          },
        };
      }

      if (peutFaireUneDemandeDeChangement) {
        return {
          nom,
          affichage: {
            url: Routes.Actionnaire.changement.demander(identifiantProjet.formatter()),
            label: 'Faire une demande de changement',
            action: 'Demander un changement d’actionnaire(s)',
          },
        };
      }
      return {
        nom,
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
        affichage: role.aLaPermission('candidature.corriger')
          ? {
              url: Routes.Candidature.corriger(identifiantProjet.formatter()),
              label: 'Modifier la candidature',
            }
          : undefined,
      };
    }

    return {
      nom: '',
    };
  } catch (error) {
    getLogger().error(error);
    return undefined;
  }
};
