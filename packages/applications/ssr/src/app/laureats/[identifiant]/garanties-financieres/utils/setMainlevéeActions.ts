import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { MainlevéeEnCoursProps } from '@/components/pages/garanties-financières/détails/components/MainlevéeEnCours';

import { HistoriqueMainlevéeRejetéeProps } from '../../../../../components/pages/garanties-financières/détails/components/HistoriqueMainlevéeRejetée';

type Props = {
  estDreal: boolean;
  estPorteur: boolean;
  hasHistorique: boolean;
  hasMainlevée: boolean;
  mainlevéeStatut?: GarantiesFinancières.ConsulterDemandeMainlevéeGarantiesFinancièresReadModel['statut'];
};

export const setMainlevéeActions = ({
  estDreal,
  estPorteur,
  hasHistorique,
  hasMainlevée,
  mainlevéeStatut,
}: Props): {
  mainlevéeActions: MainlevéeEnCoursProps['mainlevéeEnCours']['actions'];
  historiqueMainlevéeActions: HistoriqueMainlevéeRejetéeProps['historiqueMainlevée']['actions'];
} => {
  const mainlevéeActions: MainlevéeEnCoursProps['mainlevéeEnCours']['actions'] = [];
  const historiqueMainlevéeActions: HistoriqueMainlevéeRejetéeProps['historiqueMainlevée']['actions'] =
    [];

  if (estDreal) {
    mainlevéeActions.push('voir-appel-offre-info');
  }
  if (hasMainlevée && mainlevéeStatut) {
    if (estPorteur && mainlevéeStatut.estDemandé()) {
      mainlevéeActions.push('annuler-demande-mainlevée-gf');
    }
    if (estDreal) {
      if (mainlevéeStatut.estDemandé()) {
        mainlevéeActions.push('instruire-demande-mainlevée-gf');
        mainlevéeActions.push('accorder-ou-rejeter-demande-mainlevée-gf');
      }
      if (mainlevéeStatut.estEnInstruction()) {
        mainlevéeActions.push('accorder-ou-rejeter-demande-mainlevée-gf');
      }
      if (hasHistorique || mainlevéeStatut.estAccordé()) {
        historiqueMainlevéeActions.push('modifier-courrier-réponse-mainlevée-gf');
        mainlevéeActions.push('modifier-courrier-réponse-mainlevée-gf');
      }
    }
  }
  return {
    mainlevéeActions,
    historiqueMainlevéeActions,
  };
};
