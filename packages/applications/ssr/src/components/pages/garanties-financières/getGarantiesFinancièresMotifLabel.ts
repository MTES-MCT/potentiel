import { GarantiesFinancières } from '@potentiel-domain/laureat';

export const getGarantiesFinancièresMotifLabel = (
  type: GarantiesFinancières.MotifDemandeGarantiesFinancières.RawType,
) => {
  switch (type) {
    case 'changement-producteur':
      return 'Changement de producteur';
    case 'recours-accordé':
      return 'Recours accordé';
    case 'échéance-garanties-financières-actuelles':
      return 'Garanties financières arrivées à échéance';
    case 'motif-inconnu':
      return 'Inconnu';
  }
};
