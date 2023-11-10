import Badge from '@codegouvfr/react-dsfr/Badge';
import { ConsulterCandidatureReadModel } from '@potentiel-domain/candidature';
import { FC } from 'react';

type ProjectStatusBadgeProps = { statut: ConsulterCandidatureReadModel['statut'] };

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
