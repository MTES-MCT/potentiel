import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-applications/routes';

import routes from '../../../../routes';

import { checkAbandonAndAchèvement } from './checkLauréat/checkAbandonAndAchèvement';
import { getLogger } from '@potentiel-libraries/monitoring';
import { mediator } from 'mediateur';

export type GetDélaiForProjectPage = {
  affichage?: {
    label?: string;
    labelActions: string;
    url: string;
  };
};

export const getDélai = async (
  identifiantProjet: IdentifiantProjet.ValueType,
  legacyProjetId: string,
  identifiantUtilisateur: string,
  rôle: string,
  features: Array<string>,
): Promise<GetDélaiForProjectPage> => {
  try {
    const role = Role.convertirEnValueType(rôle);
    const { aUnAbandonEnCours, estAbandonné, estAchevé } = await checkAbandonAndAchèvement(
      identifiantProjet,
      rôle,
    );

    const demandeEnCours = role.aLaPermission('délai.consulterDemande')
      ? (
          await mediator.send<Lauréat.Délai.ListerDemandeDélaiQuery>({
            type: 'Lauréat.Délai.Query.ListerDemandeDélai',
            data: {
              identifiantProjet: identifiantProjet.formatter(),
              range: { startPosition: 0, endPosition: 1 },
              utilisateur: identifiantUtilisateur,
              statuts: Lauréat.Délai.StatutDemandeDélai.statutsEnCours,
            },
          })
        ).items[0]
      : undefined;

    if (demandeEnCours) {
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

    return {
      affichage:
        role.aLaPermission('délai.demander') && !aUnAbandonEnCours && !estAbandonné && !estAchevé
          ? {
              labelActions: 'Demander un délai',
              url: features.includes('délai')
                ? Routes.Délai.demander(identifiantProjet.formatter())
                : routes.DEMANDER_DELAI(legacyProjetId),
            }
          : undefined,
    };
  } catch (error) {
    getLogger().error(error);
    return {};
  }
};
