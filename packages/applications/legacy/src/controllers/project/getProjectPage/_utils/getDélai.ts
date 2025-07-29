import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-applications/routes';

import routes from '../../../../routes';

import { checkAbandonAndAchèvement } from './checkLauréat/checkAbandonAndAchèvement';

export const getDélai = async (
  identifiantProjet: IdentifiantProjet.ValueType,
  legacyProjetId: string,
  rôle: string,
  features: Array<string>,
): Promise<{
  affichage?: {
    labelActions: string;
    url: string;
  };
}> => {
  const role = Role.convertirEnValueType(rôle);
  const { aUnAbandonEnCours, estAbandonné, estAchevé } = await checkAbandonAndAchèvement(
    identifiantProjet,
    rôle,
  );

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
};
