import Badge, { BadgeProps } from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { Lauréat } from '@potentiel-domain/projet';

export type StatutAbandonBadgeProps = {
  statut: Lauréat.Abandon.StatutAbandon.RawType;
  small?: true;
};

const convertStatutAbandonToBadgeSeverityAndLabel: Record<
  Lauréat.Abandon.StatutAbandon.RawType,
  { badgeSeverity: BadgeProps['severity'] | undefined; label: string }
> = {
  demandé: { badgeSeverity: 'new', label: 'Demandé' },
  confirmé: { badgeSeverity: 'new', label: 'Confirmé' },
  accordé: { badgeSeverity: 'success', label: 'Accordé' },
  rejeté: { badgeSeverity: 'warning', label: 'Rejeté' },
  annulé: { badgeSeverity: 'warning', label: 'Annulé' },
  'confirmation-demandée': { badgeSeverity: 'info', label: 'Confirmation demandée' },
  'en-instruction': { badgeSeverity: 'info', label: 'En instruction' },
  inconnu: { badgeSeverity: undefined, label: 'Inconnu' },
};

export const StatutAbandonBadge: FC<StatutAbandonBadgeProps> = ({ statut, small }) => (
  <Badge
    noIcon
    severity={convertStatutAbandonToBadgeSeverityAndLabel[statut].badgeSeverity}
    small={small}
  >
    {convertStatutAbandonToBadgeSeverityAndLabel[statut].label}
  </Badge>
);
