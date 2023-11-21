import { FC } from 'react';
import Badge from '@codegouvfr/react-dsfr/Badge';

export type StatutAbandonBadgeProps = {
  statut: string;
  className?: string;
  small?: true;
};
export const StatutAbandonBadge: FC<StatutAbandonBadgeProps> = ({
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
