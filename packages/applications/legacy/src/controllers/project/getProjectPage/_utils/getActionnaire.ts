import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { checkAutorisationChangement } from './checkLauréat/checkAutorisationChangement';

type GetActionnaireAffichageForProjectPage = {
  label: string;
  labelActions?: string;
  url: string;
};
export type GetActionnaireForProjectPage = {
  nom: string;
  affichage?: GetActionnaireAffichageForProjectPage;
};

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: string;
  demandeNécessiteInstruction: boolean;
  règlesChangementPourAppelOffres: AppelOffre.RèglesDemandesChangement['actionnaire'];
};

export const getActionnaire = async ({
  identifiantProjet,
  rôle,
  demandeNécessiteInstruction,
  règlesChangementPourAppelOffres,
}: Props): Promise<GetActionnaireForProjectPage | undefined> => {
  try {
    const role = Role.convertirEnValueType(rôle);

    const actionnaire = await mediator.send<Lauréat.Actionnaire.ConsulterActionnaireQuery>({
      type: 'Lauréat.Actionnaire.Query.ConsulterActionnaire',
      data: { identifiantProjet: identifiantProjet.formatter() },
    });

    if (Option.isSome(actionnaire)) {
      const { actionnaire: nom, dateDemandeEnCours } = actionnaire;

      if (dateDemandeEnCours) {
        return {
          nom,
          affichage: role.aLaPermission('actionnaire.consulterChangement')
            ? {
                url: Routes.Actionnaire.changement.détails(
                  identifiantProjet.formatter(),
                  dateDemandeEnCours.formatter(),
                ),
                label: 'Voir la demande de modification',
                labelActions: 'Demande de modification d’actionnaire(s)',
              }
            : undefined,
        };
      }

      const { peutModifier, peutFaireUneDemandeDeChangement, peutEnregistrerChangement } =
        await checkAutorisationChangement<'actionnaire'>({
          rôle: Role.convertirEnValueType(rôle),
          identifiantProjet,
          règlesChangementPourAppelOffres,
          conditionsÀRemplirSpécifiquesAuDomain: demandeNécessiteInstruction,
          domain: 'actionnaire',
        });

      if (peutModifier) {
        return {
          nom,
          affichage: {
            url: Routes.Actionnaire.modifier(identifiantProjet.formatter()),
            label: 'Modifier',
            labelActions: 'Modifier l’actionnaire(s)',
          },
        };
      }

      if (peutEnregistrerChangement) {
        return {
          nom,
          affichage: {
            url: Routes.Actionnaire.changement.enregistrer(identifiantProjet.formatter()),
            label: 'Faire un changement',
            labelActions: "Changer d'actionnaire(s)",
          },
        };
      }

      if (peutFaireUneDemandeDeChangement) {
        return {
          nom,
          affichage: {
            url: Routes.Actionnaire.changement.demander(identifiantProjet.formatter()),
            label: 'Faire une demande de changement',
            labelActions: 'Demander un changement d’actionnaire(s)',
          },
        };
      }
      return {
        nom,
      };
    }

    return undefined;
  } catch (error) {
    getLogger().error(error);
    return undefined;
  }
};
