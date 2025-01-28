import { mediator } from 'mediateur';
import { Abandon, Actionnaire } from '@potentiel-domain/laureat';

import { Option } from '@potentiel-libraries/monads';
import { Candidature } from '@potentiel-domain/candidature';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { getAttestationDeConformité } from './getAttestationDeConformité';

export type GetActionnaireForProjectPage = {
  nom: string;
  affichage?: {
    label: string;
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
      const nom = actionnaire.actionnaire;

      const dateDemandeExistanteDeChangement =
        await mediator.send<Actionnaire.ConsulterDateChangementActionnaireQuery>({
          type: 'Lauréat.Actionnaire.Query.ConsulterDateChangementActionnaire',
          data: { identifiantProjet: identifiantProjet.formatter() },
        });

      if (Option.isSome(dateDemandeExistanteDeChangement)) {
        return {
          nom,
          demandeEnCours: role.aLaPermission('actionnaire.consulterChangement')
            ? {
                demandéeLe: dateDemandeExistanteDeChangement.formatter(),
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
            label: "Changer d'actionnaire(s)",
          },
        };
      }

      if (peutEnregistrerChangement) {
        return {
          nom,
          affichage: {
            url: Routes.Actionnaire.modifier(identifiantProjet.formatter()),
            label: "Changer d'actionnaire(s)",
          },
        };
      }

      if (peutFaireUneDemandeDeChangement) {
        return {
          nom,
          affichage: {
            url: Routes.Actionnaire.changement.demander(identifiantProjet.formatter()),
            label: 'Demander un changement d’actionnaire(s)',
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

const checkAbandonAndAchèvement = async (
  identifiantProjet: Props['identifiantProjet'],
  rôle: Props['rôle'],
) => {
  const attestationConformitéExistante = await getAttestationDeConformité(identifiantProjet, rôle);

  if (attestationConformitéExistante) {
    return true;
  }

  try {
    const abandon = await mediator.send<Abandon.ConsulterAbandonQuery>({
      type: 'Lauréat.Abandon.Query.ConsulterAbandon',
      data: { identifiantProjetValue: identifiantProjet.formatter() },
    });
    if (Option.isNone(abandon)) return false;
    return abandon.statut.estAccordé() || abandon.statut.estEnCours();
  } catch (e) {
    getLogger('getActionnaire.checkActionnaire').warn("Impossible de récupérer l'abandon", {
      error: (e as Error)?.message,
      identifiantProjet: identifiantProjet.formatter(),
    });
    return false;
  }
};
