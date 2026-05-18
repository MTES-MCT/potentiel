import type { AlertProps } from '@codegouvfr/react-dsfr/Alert';
import Badge from '@codegouvfr/react-dsfr/Badge';
import type { FC } from 'react';

import type { Lauréat } from '@potentiel-domain/projet';

import { getStatutMainlevéeLabel } from '../_helpers/statutMainlevéeLabels';

const convertStatutMainlevéeToBadgeSeverity: Record<
  Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.RawType,
  AlertProps.Severity
> = {
  accordé: 'success',
  demandé: 'info',
  'en-instruction': 'warning',
  rejeté: 'error',
};

export const StatutMainlevéeBadge: FC<{
  statut: Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.RawType;
}> = ({ statut }) => (
  <Badge small noIcon severity={convertStatutMainlevéeToBadgeSeverity[statut]}>
    {getStatutMainlevéeLabel(statut)}
  </Badge>
);
