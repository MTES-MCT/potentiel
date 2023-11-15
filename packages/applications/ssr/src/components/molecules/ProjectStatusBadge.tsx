import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

type ProjectStatusBadgeProps = { statut: 'non-notifié' | 'abandonné' | 'classé' | 'éliminé' };

export const ProjectStatusBadge: FC<ProjectStatusBadgeProps> = ({ statut }) => (
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
