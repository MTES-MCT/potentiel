import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { Abandon } from '@potentiel-domain/laureat';

export type StatutBadgeProps = {
  statut: Abandon.StatutAbandon.RawType;
  small?: true;
};
export const StatutBadge: FC<StatutBadgeProps> = ({ statut, small }) => (
  <Badge noIcon severity={getSeverity(statut)} small={small}>
    {statut}
  </Badge>
);

const getSeverity = (statut: StatutBadgeProps['statut']) => {
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
