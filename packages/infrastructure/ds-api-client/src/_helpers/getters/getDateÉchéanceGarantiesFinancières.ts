import { DateTime } from '@potentiel-domain/common';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import type { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import type { getTypeGarantiesFinancières } from '../index.js';
import type { getDateConstitutionGarantiesFinancières } from './getDateConstitutionGarantiesFinancières.js';

export const getDateÉchéanceGarantiesFinancières = ({
  dateConstitutionGarantiesFinancières,
  typeGarantiesFinancières,
  dateÉchéanceGarantiesFinancières,
}: {
  dateConstitutionGarantiesFinancières: ReturnType<typeof getDateConstitutionGarantiesFinancières>;
  typeGarantiesFinancières: ReturnType<typeof getTypeGarantiesFinancières>;
  dateÉchéanceGarantiesFinancières?: Iso8601DateTime;
}) => {
  if (typeGarantiesFinancières === 'garantie-bancaire' && dateConstitutionGarantiesFinancières) {
    const délaiÉchéanceGarantieBancaireEnMois = appelsOffreData.find(
      (ao) => ao.id === 'PPE2 - Petit PV',
    )?.garantiesFinancières.délaiÉchéanceGarantieBancaireEnMois;

    return délaiÉchéanceGarantieBancaireEnMois
      ? DateTime.convertirEnValueType(dateConstitutionGarantiesFinancières)
          .ajouterNombreDeMois(délaiÉchéanceGarantieBancaireEnMois)
          .formatter()
      : undefined;
  }

  if (typeGarantiesFinancières === 'avec-date-échéance' && dateÉchéanceGarantiesFinancières) {
    return dateÉchéanceGarantiesFinancières;
  }
};
