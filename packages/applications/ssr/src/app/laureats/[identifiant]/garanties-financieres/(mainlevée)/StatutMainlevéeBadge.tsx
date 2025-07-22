import { AlertProps } from '@codegouvfr/react-dsfr/Alert';
import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { convertStatutMainlevéeForView } from './_helpers';

const convertStatutMainlevéeToBadgeSeverity: Record<
  GarantiesFinancières.StatutMainlevéeGarantiesFinancières.RawType,
  AlertProps.Severity
> = {
  accordé: 'success',
  demandé: 'info',
  'en-instruction': 'warning',
  rejeté: 'error',
};

export const StatutMainlevéeBadge: FC<{
  statut: GarantiesFinancières.StatutMainlevéeGarantiesFinancières.RawType;
}> = ({ statut }) => (
  <Badge small noIcon severity={convertStatutMainlevéeToBadgeSeverity[statut]}>
    {convertStatutMainlevéeForView(statut)}
  </Badge>
);
