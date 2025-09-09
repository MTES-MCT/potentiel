import { AlertProps } from '@codegouvfr/react-dsfr/Alert';
import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { Lauréat } from '@potentiel-domain/projet';

const convertStatutGarantiesFinancièresToBadgeSeverity: Record<
  Lauréat.GarantiesFinancières.StatutGarantiesFinancières.RawType,
  AlertProps.Severity
> = {
  validé: 'success',
  levé: 'info',
  échu: 'warning',
};

export const StatutGarantiesFinancièresBadge: FC<{
  statut: Lauréat.GarantiesFinancières.StatutGarantiesFinancières.RawType;
}> = ({ statut }) => (
  <Badge small noIcon severity={convertStatutGarantiesFinancièresToBadgeSeverity[statut]}>
    {statut.toLocaleUpperCase()}
  </Badge>
);
