import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Role } from '@potentiel-domain/utilisateur';

import { HistoriqueMainlevéeRejetéeProps } from '@/components/pages/garanties-financières/détails/components/Mainlevée/HistoriqueMainlevéeRejetée';

type GetHistoriqueMainlevéeRéjetéesActions = {
  role: Role.ValueType;
  mainlevée?: GarantiesFinancières.ListerMainlevéeItemReadModel;
  historiqueMainlevéeRejetée?: GarantiesFinancières.ListerMainlevéesReadModel['items'];
};
export const getHistoriqueMainlevéeRejetéesActions = ({
  role,
  mainlevée,
  historiqueMainlevéeRejetée,
}: GetHistoriqueMainlevéeRéjetéesActions) => {
  const actions: HistoriqueMainlevéeRejetéeProps['historiqueMainlevée']['actions'] = [];
  const estDreal = role.estÉgaleÀ(Role.dreal);
  const hasHistorique = historiqueMainlevéeRejetée && historiqueMainlevéeRejetée.length > 0;

  if (!mainlevée) {
    return actions;
  }

  if (estDreal && (mainlevée.statut.estAccordé() || hasHistorique)) {
    actions.push('modifier-courrier-réponse-mainlevée-gf');
  }

  return actions;
};
