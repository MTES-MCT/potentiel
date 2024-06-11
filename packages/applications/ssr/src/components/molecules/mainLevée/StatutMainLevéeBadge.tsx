import { AlertProps } from '@codegouvfr/react-dsfr/Alert';
import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { convertStatutMainLeveeForView } from '../../pages/garanties-financières/mainLevée/helper';

const convertStatutMainLevéeToBadgeSeverity: Record<
  GarantiesFinancières.StatutMainLevéeGarantiesFinancières.RawType,
  AlertProps.Severity
> = {
  accordé: 'success',
  demandé: 'info',
  'en-instruction': 'warning',
  rejeté: 'error',
};

export const StatutMainLevéeBadge: FC<{
  statut: GarantiesFinancières.StatutMainLevéeGarantiesFinancières.RawType;
}> = ({ statut }) => (
  <Badge small noIcon severity={convertStatutMainLevéeToBadgeSeverity[statut]}>
    {convertStatutMainLeveeForView(statut)}
  </Badge>
);
