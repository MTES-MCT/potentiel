import Badge, { BadgeProps } from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { Éliminé } from '@potentiel-domain/projet';

export type StatutRecoursBadgeProps = {
  statut: Éliminé.Recours.StatutRecours.RawType;
  small?: true;
};

const convertStatutRecoursToBadgeSeverityAndLabel: Record<
  Éliminé.Recours.StatutRecours.RawType,
  { badgeSeverity: BadgeProps['severity'] | undefined; label: string }
> = {
  demandé: { badgeSeverity: 'new', label: 'Demandé' },
  accordé: { badgeSeverity: 'success', label: 'Accordé' },
  rejeté: { badgeSeverity: 'warning', label: 'Rejeté' },
  annulé: { badgeSeverity: 'warning', label: 'Annulé' },
  'en-instruction': { badgeSeverity: 'info', label: 'En instruction' },
  inconnu: { badgeSeverity: undefined, label: 'Inconnu' },
};

export const StatutRecoursBadge: FC<StatutRecoursBadgeProps> = ({ statut, small }) => (
  <Badge
    noIcon
    severity={convertStatutRecoursToBadgeSeverityAndLabel[statut].badgeSeverity}
    small={small}
  >
    {convertStatutRecoursToBadgeSeverityAndLabel[statut].label}
  </Badge>
);
