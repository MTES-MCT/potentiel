import { AlertProps } from '@codegouvfr/react-dsfr/Alert';
import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

const convertStatutGarantiesFinancièresToBadgeSeverity: Record<
  GarantiesFinancières.StatutGarantiesFinancières.RawType,
  AlertProps.Severity
> = {
  échu: 'error',
  validé: 'success',
  levé: 'info',
};

export const StatutGarantiesFinancièresBadge: FC<{
  statut: GarantiesFinancières.StatutGarantiesFinancières.RawType;
}> = ({ statut }) => (
  <Badge small noIcon severity={convertStatutGarantiesFinancièresToBadgeSeverity[statut]}>
    {statut.toLocaleUpperCase()}
  </Badge>
);
