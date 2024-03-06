import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { Abandon } from '@potentiel-domain/laureat';

export type StatutAbandonBadgeProps = {
  statut: Abandon.StatutAbandon.RawType;
  small?: true;
};
export const StatutAbandonBadge: FC<StatutAbandonBadgeProps> = ({ statut, small }) => (
  <Badge noIcon severity={getSeverity(statut)} small={small}>
    {statut}
  </Badge>
);

const getSeverity = (statut: StatutAbandonBadgeProps['statut']) => {
  switch (statut) {
    case 'demandé':
    case 'confirmé':
      return 'new';
    case 'accordé':
      return 'success';
    case 'rejeté':
    case 'annulé':
      return 'warning';
    case 'confirmation-demandée':
      return 'info';
    case 'inconnu':
      return undefined;
  }
};
