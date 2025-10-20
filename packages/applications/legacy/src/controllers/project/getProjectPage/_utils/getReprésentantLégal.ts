import { mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { checkAutorisationChangement } from './checkLauréat/checkAutorisationChangement';

export type GetReprésentantLégalForProjectPage = {
  nom: string;
  affichage?: {
    labelActions?: string;
    label: string;
    url: string;
  };
};

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: string;
  règlesChangementPourAppelOffres: AppelOffre.RèglesDemandesChangement['représentantLégal'];
};

export const getReprésentantLégal = async ({
  identifiantProjet,
  rôle,
  règlesChangementPourAppelOffres,
}: Props): Promise<GetReprésentantLégalForProjectPage | undefined> => {
  try {
    const utilisateur = Role.convertirEnValueType(rôle);

    const représentantLégal =
      await mediator.send<Lauréat.ReprésentantLégal.ConsulterReprésentantLégalQuery>({
        type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
        data: { identifiantProjet: identifiantProjet.formatter() },
      });

    if (Option.isSome(représentantLégal)) {
      const demandeEnCours =
        await mediator.send<Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalEnCoursQuery>(
          {
            type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégalEnCours',
            data: {
              identifiantProjet: identifiantProjet.formatter(),
            },
          },
        );

      if (Option.isSome(demandeEnCours)) {
        return {
          nom: représentantLégal.nomReprésentantLégal,
          affichage: utilisateur.aLaPermission('représentantLégal.consulterChangement')
            ? {
                url: Routes.ReprésentantLégal.changement.détails(
                  identifiantProjet.formatter(),
                  demandeEnCours.demandéLe.formatter(),
                ),
                label: 'Voir la demande de modification',
                labelActions: 'Demande de modification de représentant légal',
              }
            : undefined,
        };
      }

      const { peutModifier, peutFaireUneDemandeDeChangement, peutEnregistrerChangement } =
        await checkAutorisationChangement<'représentantLégal'>({
          rôle: Role.convertirEnValueType(rôle),
          identifiantProjet,
          règlesChangementPourAppelOffres,
          domain: 'représentantLégal',
        });

      if (peutModifier) {
        return {
          nom: représentantLégal.nomReprésentantLégal,
          affichage: {
            url: Routes.ReprésentantLégal.modifier(identifiantProjet.formatter()),
            label: 'Modifier',
            labelActions: 'Modifier le représentant légal',
          },
        };
      }

      if (peutFaireUneDemandeDeChangement) {
        return {
          nom: représentantLégal.nomReprésentantLégal,
          affichage: {
            url: Routes.ReprésentantLégal.changement.demander(identifiantProjet.formatter()),
            label: 'Changer de représentant légal',
            labelActions: 'Changer de représentant légal',
          },
        };
      }

      if (peutEnregistrerChangement) {
        return {
          nom: représentantLégal.nomReprésentantLégal,
          affichage: {
            url: Routes.ReprésentantLégal.changement.enregistrer(identifiantProjet.formatter()),
            label: 'Changer de représentant légal',
            labelActions: 'Changer de représentant légal',
          },
        };
      }
    }

    return undefined;
  } catch (error) {
    getLogger('Legacy|getProjectPage|getReprésentantLégal').error(error);
    return undefined;
  }
};
