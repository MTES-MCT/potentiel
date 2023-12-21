import { FC } from 'react';
import Badge from '@codegouvfr/react-dsfr/Badge';

export type StatutBadgeProps = {
  statut: string;
  small?: true;
};
export const StatutBadge: FC<StatutBadgeProps> = ({ statut, small }) => (
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
