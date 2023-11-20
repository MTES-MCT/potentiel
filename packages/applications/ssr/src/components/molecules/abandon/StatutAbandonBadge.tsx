import { FC } from 'react';
import Badge from '@codegouvfr/react-dsfr/Badge';

export type StatutAbandonBadgeProps = {
  statut: string;
  small?: true;
};
export const StatutAbandonBadge: FC<StatutAbandonBadgeProps> = ({ statut, small }) => (
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
  >
    {statut}
  </Badge>
);
