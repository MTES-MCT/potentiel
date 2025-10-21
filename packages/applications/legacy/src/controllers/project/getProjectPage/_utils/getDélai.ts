import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-applications/routes';

import { getLogger } from '@potentiel-libraries/monitoring';
import { mediator } from 'mediateur';
import { checkAutorisationChangement } from './checkLauréat/checkAutorisationChangement';
import { AppelOffre } from '@potentiel-domain/appel-offre';

export type GetDélaiForProjectPage = {
  affichage?: {
    label?: string;
    labelActions: string;
    url: string;
  };
};

type GetDélai = (args: {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: string;
  rôle: string;
  règlesChangementPourAppelOffres: AppelOffre.RèglesDemandesChangement['délai'];
}) => Promise<GetDélaiForProjectPage>;

export const getDélai: GetDélai = async ({
  identifiantProjet,
  identifiantUtilisateur,
  rôle,
  règlesChangementPourAppelOffres,
}) => {
  try {
    const role = Role.convertirEnValueType(rôle);

    const demandeEnCours = (
      await mediator.send<Lauréat.Délai.ListerDemandeDélaiQuery>({
        type: 'Lauréat.Délai.Query.ListerDemandeDélai',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
          range: { startPosition: 0, endPosition: 1 },
          utilisateur: identifiantUtilisateur,
          statuts: Lauréat.Délai.StatutDemandeDélai.statutsEnCours,
        },
      })
    ).items[0];

    if (demandeEnCours && role.aLaPermission('délai.consulterDemande')) {
      return {
        affichage: {
          label: 'Voir la demande de délai',
          labelActions: 'Demander un délai',
          url: Routes.Délai.détail(
            identifiantProjet.formatter(),
            demandeEnCours.demandéLe.formatter(),
          ),
        },
      };
    }

    const { peutFaireUneDemandeDeChangement } = await checkAutorisationChangement<'délai'>({
      rôle: Role.convertirEnValueType(rôle),
      identifiantProjet,
      règlesChangementPourAppelOffres,
    });

    const affichage = peutFaireUneDemandeDeChangement
      ? {
          labelActions: 'Demander un délai',
          url: Routes.Délai.demander(identifiantProjet.formatter()),
        }
      : undefined;

    return {
      affichage,
    };
  } catch (error) {
    getLogger().error(error);
    return {};
  }
};
