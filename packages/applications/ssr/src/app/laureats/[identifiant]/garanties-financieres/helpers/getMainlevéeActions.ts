import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Role } from '@potentiel-domain/utilisateur';

import { MainlevéeEnCoursProps } from '@/components/pages/garanties-financières/détails/components/Mainlevée/MainlevéeEnCours';

type GetMainlevéeActions = {
  role: Role.ValueType;
  mainlevée?: GarantiesFinancières.ListerMainlevéeItemReadModel;
};
export const getMainlevéeActions = ({ role, mainlevée }: GetMainlevéeActions) => {
  const actions: MainlevéeEnCoursProps['mainlevéeEnCours']['actions'] = [];

  const estPorteur = role.estÉgaleÀ(Role.porteur);
  const estDreal = role.estÉgaleÀ(Role.dreal);

  if (estDreal) {
    actions.push('voir-appel-offre-info');
  }

  if (!mainlevée) {
    return actions;
  }

  if (estPorteur && mainlevée.statut.estDemandé()) {
    actions.push('annuler-demande-mainlevée-gf');
  }

  if (estDreal) {
    if (mainlevée.statut.estDemandé()) {
      actions.push('instruire-demande-mainlevée-gf');
      actions.push('accorder-ou-rejeter-demande-mainlevée-gf');
    }

    if (mainlevée.statut.estEnInstruction()) {
      actions.push('accorder-ou-rejeter-demande-mainlevée-gf');
    }

    if (mainlevée.statut.estAccordé() || mainlevée.statut.estRejeté()) {
      actions.push('modifier-courrier-réponse-mainlevée-gf');
    }
  }

  return actions;
};
