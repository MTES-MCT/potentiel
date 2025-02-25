import Badge, { BadgeProps } from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { Abandon } from '@potentiel-domain/laureat';

export type StatutAbandonBadgeProps = {
  statut: Abandon.StatutAbandon.RawType;
  small?: true;
};

const convertStatutAbandonToBadgeSeverity: Record<
  Abandon.StatutAbandon.RawType,
  BadgeProps['severity'] | undefined
> = {
  demandé: 'new',
  confirmé: 'new',
  accordé: 'success',
  rejeté: 'warning',
  annulé: 'warning',
  'confirmation-demandée': 'info',
  inconnu: undefined,
};

export const StatutAbandonBadge: FC<StatutAbandonBadgeProps> = ({ statut, small }) => (
  <Badge noIcon severity={convertStatutAbandonToBadgeSeverity[statut]} small={small}>
    {statut}
  </Badge>
);
