import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { Recours } from '@potentiel-domain/elimine';

export type StatutRecoursBadgeProps = {
  statut: Recours.StatutRecours.RawType;
  small?: true;
};
export const StatutRecoursBadge: FC<StatutRecoursBadgeProps> = ({ statut, small }) => (
  <Badge noIcon severity={getSeverity(statut)} small={small}>
    {statut}
  </Badge>
);

const getSeverity = (statut: StatutRecoursBadgeProps['statut']) => {
  switch (statut) {
    case 'demandé':
      return 'new';
    case 'accordé':
      return 'success';
    case 'rejeté':
    case 'annulé':
      return 'warning';
    case 'inconnu':
      return undefined;
  }
};
