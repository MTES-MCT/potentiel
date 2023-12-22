import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

export type StatutProjetBadgeProps = { statut: 'non-notifié' | 'abandonné' | 'classé' | 'éliminé' };

export const StatutProjetBadge: FC<StatutProjetBadgeProps> = ({ statut }) => (
  <Badge
    small
    noIcon
    severity={
      statut === 'classé'
        ? 'success'
        : statut === 'abandonné'
        ? 'warning'
        : statut === 'non-notifié'
        ? 'info'
        : 'error'
    }
  >
    {statut}
  </Badge>
);
