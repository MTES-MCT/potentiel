import { FC } from 'react';
import Badge from '@codegouvfr/react-dsfr/Badge';
import { Abandon } from '@potentiel-domain/laureat';

type StatutDemandeBadgeProps = {
  statut: Abandon.StatutAbandon.RawType;
  className?: string;
  small?: true;
};
export const StatutDemandeBadge: FC<StatutDemandeBadgeProps> = ({
  statut,
  className = '',
  small,
}) => (
  <Badge
    noIcon
    severity={
      statut === 'demandé'
        ? 'new'
        : statut === 'accordé'
        ? 'success'
        : statut === 'rejeté'
        ? 'warning'
        : 'info'
    }
    small={small}
    className={`sm:ml-3 ${className}`}
  >
    {statut}
  </Badge>
);
