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
      pageProjet?: {
        label: string;
        url: string;
      };
      menu?: {
        label: string;
        url: string;
      };
      peutConsulterDemandeChangement: boolean;
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
        await mediator.send<Actionnaire.ConsulterDemandeChangementActionnaireQuery>({
          type: 'Lauréat.Actionnaire.Query.ConsulterDemandeChangementActionnaire',
          data: { identifiantProjet: identifiantProjet.formatter() },
        });

      const aUneDemandeEnCours =
        Option.isSome(demandeExistanteDeChangement) &&
        demandeExistanteDeChangement.demande.statut.estDemandé();

      const doitDemanderEtPasModifier =
        demandeNécessiteInstruction && utilisateur.aLaPermission('actionnaire.demanderChangement');

      const peutFaireUneDemandeDeChangement = doitDemanderEtPasModifier && !aUneDemandeEnCours;

      const peutModifierDirectement =
        !doitDemanderEtPasModifier &&
        utilisateur.aLaPermission('actionnaire.modifier') &&
        !aUneDemandeEnCours;

      const afficherFormulaireDemandeSurPageProjet =
        doitDemanderEtPasModifier &&
        (Option.isNone(demandeExistanteDeChangement) ||
          demandeExistanteDeChangement.demande.statut.estAnnulé());

      const afficherFormulaireModificationSurPageProjet =
        !doitDemanderEtPasModifier && Option.isNone(demandeExistanteDeChangement);

      return {
        nom: actionnaire.actionnaire,
        pageProjet: afficherFormulaireDemandeSurPageProjet
          ? {
              url: Routes.Actionnaire.changement.demander(identifiantProjet.formatter()),
              label: "Demander une modification de l'actionnariat",
            }
          : afficherFormulaireModificationSurPageProjet
            ? {
                url: Routes.Actionnaire.modifier(identifiantProjet.formatter()),
                label: 'Modifier l’actionnariat',
              }
            : undefined,
        menu: peutFaireUneDemandeDeChangement
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
        peutConsulterDemandeChangement:
          utilisateur.aLaPermission('actionnaire.consulterChangement') &&
          Option.isSome(demandeExistanteDeChangement),
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
        pageProjet: utilisateur.aLaPermission('candidature.corriger')
          ? {
              url: Routes.Candidature.corriger(identifiantProjet.formatter()),
              label: 'Modifier la candidature',
            }
          : undefined,
        menu: utilisateur.aLaPermission('candidature.corriger')
          ? {
              url: Routes.Candidature.corriger(identifiantProjet.formatter()),
              label: 'Modifier la candidature',
            }
          : undefined,
        peutConsulterDemandeChangement: false,
      };
    }

    return {
      nom: '',
      peutConsulterDemandeChangement: false,
    };
  } catch (error) {
    getLogger().error(`Impossible de consulter l'actionnaire'`, {
      identifiantProjet: identifiantProjet.formatter(),
    });
    return undefined;
  }
};
