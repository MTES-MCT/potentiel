import { AlertProps } from '@codegouvfr/react-dsfr/Alert';
import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { convertStatutMainlevéeForView } from '../../pages/garanties-financières/mainLevée/convertForView';

const convertStatutMainlevéeToBadgeSeverity: Record<
  GarantiesFinancières.StatutMainLevéeGarantiesFinancières.RawType,
  AlertProps.Severity
> = {
  accordé: 'success',
  demandé: 'info',
  'en-instruction': 'warning',
  rejeté: 'error',
};

export const StatutMainlevéeBadge: FC<{
  statut: GarantiesFinancières.StatutMainLevéeGarantiesFinancières.RawType;
}> = ({ statut }) => (
  <Badge small noIcon severity={convertStatutMainlevéeToBadgeSeverity[statut]}>
    {convertStatutMainlevéeForView(statut)}
  </Badge>
);
