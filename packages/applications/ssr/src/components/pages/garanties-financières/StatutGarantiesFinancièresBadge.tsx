import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

export type StatutGarantiesFinancièresBadgProps = {
  statut: GarantiesFinancières.StatutGarantiesFinancières.RawType;
};
export const StatutGarantiesFinancièresBadge: FC<StatutGarantiesFinancièresBadgProps> = ({
  statut,
}) => (
  <Badge
    noIcon
    severity={
      statut === 'à-traiter'
        ? 'new'
        : statut === 'validé'
        ? 'success'
        : statut === 'en-attente'
        ? 'warning'
        : 'info'
    }
    small={true}
  >
    {statut.replace(/-/g, ' ')}
  </Badge>
);
