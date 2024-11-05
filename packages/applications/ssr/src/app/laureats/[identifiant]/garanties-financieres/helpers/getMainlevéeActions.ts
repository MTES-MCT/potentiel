import { Option } from '@potentiel-libraries/monads';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Role } from '@potentiel-domain/utilisateur';

import { MainlevéeEnCoursProps } from '@/components/pages/garanties-financières/détails/components/Mainlevée/MainlevéeEnCours';

type GetMainlevéeActions = {
  role: Role.ValueType;
  mainlevée: Option.Type<GarantiesFinancières.ConsulterDemandeEnCoursMainlevéeGarantiesFinancièresReadModel>;
};
export const getMainlevéeActions = ({ role, mainlevée }: GetMainlevéeActions) => {
  const actions: MainlevéeEnCoursProps['mainlevéeEnCours']['actions'] = [];

  const estPorteur = role.estÉgaleÀ(Role.porteur);
  const estDreal = role.estÉgaleÀ(Role.dreal);
  const mainlevéeExistante = Option.isSome(mainlevée) ? mainlevée : undefined;

  if (estDreal) {
    actions.push('voir-appel-offre-info');
  }

  if (!mainlevéeExistante) {
    return actions;
  }

  if (estPorteur && mainlevéeExistante.statut.estDemandé()) {
    actions.push('annuler-demande-mainlevée-gf');
  }

  if (estDreal) {
    if (mainlevéeExistante.statut.estDemandé()) {
      actions.push('instruire-demande-mainlevée-gf');
      actions.push('accorder-ou-rejeter-demande-mainlevée-gf');
    }

    if (mainlevéeExistante.statut.estEnInstruction()) {
      actions.push('accorder-ou-rejeter-demande-mainlevée-gf');
    }

    if (mainlevéeExistante.statut.estAccordé() || mainlevéeExistante.statut.estRejeté()) {
      actions.push('modifier-courrier-réponse-mainlevée-gf');
    }
  }

  return actions;
};
