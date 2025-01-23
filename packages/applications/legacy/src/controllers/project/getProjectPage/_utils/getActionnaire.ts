import { mediator } from 'mediateur';
import { Actionnaire } from '@potentiel-domain/laureat';

import { Option } from '@potentiel-libraries/monads';
import { Candidature } from '@potentiel-domain/candidature';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/common';

export type GetActionnaireForProjectPage =
  | {
      nom: string;
      affichage?: {
        label: string;
        url: string;
      };
      afficherLienChangementSurPageProjet: boolean;
    }
  | undefined;

export const getActionnaire = async (
  identifiantProjet: IdentifiantProjet.ValueType,
  rôle: string,
  demandeNécessiteInstruction: boolean,
): Promise<GetActionnaireForProjectPage> => {
  try {
    const utilisateur = Role.convertirEnValueType(rôle);

    const actionnaire = await mediator.send<Actionnaire.ConsulterActionnaireQuery>({
      type: 'Lauréat.Actionnaire.Query.ConsulterActionnaire',
      data: { identifiantProjet: identifiantProjet.formatter() },
    });

    if (Option.isSome(actionnaire)) {
      const demandeExistanteDeChangement =
        await mediator.send<Actionnaire.ConsulterChangementActionnaireQuery>({
          type: 'Lauréat.Actionnaire.Query.ConsulterChangementActionnaire',
          data: { identifiantProjet: identifiantProjet.formatter() },
        });

      const aUneDemandeEnCours =
        Option.isSome(demandeExistanteDeChangement) &&
        demandeExistanteDeChangement.demande.statut.estDemandé();

      const peutFaireUneDemandeDeChangement =
        demandeNécessiteInstruction &&
        utilisateur.aLaPermission('actionnaire.demanderChangement') &&
        !aUneDemandeEnCours;

      const peutModifierDirectement =
        !demandeNécessiteInstruction &&
        utilisateur.aLaPermission('actionnaire.modifier') &&
        !aUneDemandeEnCours;

      return {
        nom: actionnaire.actionnaire,
        affichage: peutFaireUneDemandeDeChangement
          ? {
              url: Routes.Actionnaire.changement.demander(identifiantProjet.formatter()),
              label: "Demander une modification de l'actionnariat",
            }
          : peutModifierDirectement
            ? {
                url: Routes.Actionnaire.modifier(identifiantProjet.formatter()),
                label: 'Modifier l’actionnariat',
              }
            : undefined,
        afficherLienChangementSurPageProjet:
          utilisateur.aLaPermission('actionnaire.consulterChangement') && aUneDemandeEnCours,
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
        affichage: utilisateur.aLaPermission('candidature.corriger')
          ? {
              url: Routes.Candidature.corriger(identifiantProjet.formatter()),
              label: 'Modifier la candidature',
            }
          : undefined,
        afficherLienChangementSurPageProjet: false,
      };
    }

    return {
      nom: '',
      afficherLienChangementSurPageProjet: false,
    };
  } catch (error) {
    getLogger().error(`Impossible de consulter l'actionnaire'`, {
      identifiantProjet: identifiantProjet.formatter(),
    });
    return undefined;
  }
};
