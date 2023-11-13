import { FC } from 'react';
import Badge from '@codegouvfr/react-dsfr/Badge';
import { Abandon } from '@potentiel-domain/laureat';

type StatutAbandonBadgeProps = {
  statut: Abandon.StatutAbandon.RawType;
};
export const StatutAbandonBadge: FC<StatutAbandonBadgeProps> = ({ statut }) => (
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
    small
    className="sm:ml-3"
  >
    {statut}
  </Badge>
);
