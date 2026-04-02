import { AlertProps } from '@codegouvfr/react-dsfr/Alert';
import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { Lauréat } from '@potentiel-domain/projet';

import { getStatutMainlevéeLabel } from './_helpers';

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
