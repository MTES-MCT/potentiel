import { Option } from '@potentiel-libraries/monads';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Role } from '@potentiel-domain/utilisateur';

import { HistoriqueMainlevéeRejetéeProps } from '@/components/pages/garanties-financières/détails/components/Mainlevée/HistoriqueMainlevéeRejetée';

type GetHistoriqueMainlevéeRéjetéesActions = {
  role: Role.ValueType;
  mainlevée: Option.Type<GarantiesFinancières.ConsulterDemandeEnCoursMainlevéeGarantiesFinancièresReadModel>;
  historiqueMainlevéeRejetée: Option.Type<GarantiesFinancières.ConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresReadModel>;
};
export const getHistoriqueMainlevéeRejetéesActions = ({
  role,
  mainlevée,
  historiqueMainlevéeRejetée,
}: GetHistoriqueMainlevéeRéjetéesActions) => {
  const actions: HistoriqueMainlevéeRejetéeProps['historiqueMainlevée']['actions'] = [];
  const estDreal = role.estÉgaleÀ(Role.dreal);
  const mainlevéeExistante = Option.isSome(mainlevée) ? mainlevée : undefined;
  const historique =
    Option.isSome(historiqueMainlevéeRejetée) && historiqueMainlevéeRejetée.length > 0
      ? historiqueMainlevéeRejetée
      : undefined;

  if (!mainlevéeExistante) {
    return actions;
  }

  if (estDreal && (mainlevéeExistante.statut.estAccordé() || historique)) {
    actions.push('modifier-courrier-réponse-mainlevée-gf');
  }

  return actions;
};
