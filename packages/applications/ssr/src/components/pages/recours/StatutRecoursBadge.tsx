import Badge, { BadgeProps } from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { Recours } from '@potentiel-domain/elimine';

export type StatutRecoursBadgeProps = {
  statut: Recours.StatutRecours.RawType;
  small?: true;
};

const convertStatutRecoursToBadgeSeverity: Record<
  Recours.StatutRecours.RawType,
  BadgeProps['severity'] | undefined
> = {
  demandé: 'new',
  accordé: 'success',
  rejeté: 'warning',
  annulé: 'warning',
  inconnu: undefined,
};

export const StatutRecoursBadge: FC<StatutRecoursBadgeProps> = ({ statut, small }) => (
  <Badge noIcon severity={convertStatutRecoursToBadgeSeverity[statut]} small={small}>
    {statut}
  </Badge>
);
