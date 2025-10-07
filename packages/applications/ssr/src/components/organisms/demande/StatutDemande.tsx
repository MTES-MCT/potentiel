import Badge, { BadgeProps } from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

export type StatutDemandeBadgeProps = {
  statut:
    | 'demandé'
    | 'confirmé'
    | 'accordé'
    | 'rejeté'
    | 'annulé'
    | 'en-instruction'
    | 'inconnu'
    | 'information-enregistrée'
    | 'confirmation-demandée';
  small?: true;
};

const convertStatutDemandeToBadgeSeverityAndLabel: Record<
  StatutDemandeBadgeProps['statut'],
  { badgeSeverity: BadgeProps['severity'] | undefined; label: string }
> = {
  demandé: { badgeSeverity: 'new', label: 'demandé' },
  confirmé: { badgeSeverity: 'new', label: 'confirmé' },
  accordé: { badgeSeverity: 'success', label: 'accordé' },
  rejeté: { badgeSeverity: 'warning', label: 'rejeté' },
  annulé: { badgeSeverity: 'warning', label: 'annulé' },
  'confirmation-demandée': { badgeSeverity: 'info', label: 'confirmation demandée' },
  'en-instruction': { badgeSeverity: 'info', label: 'en instruction' },
  'information-enregistrée': { badgeSeverity: 'success', label: 'information enregistrée' },
  inconnu: { badgeSeverity: undefined, label: 'inconnu' },
};

export const StatutDemandeBadge: FC<StatutDemandeBadgeProps> = ({ statut, small }) => (
  <Badge
    noIcon
    severity={convertStatutDemandeToBadgeSeverityAndLabel[statut].badgeSeverity}
    small={small}
  >
    {convertStatutDemandeToBadgeSeverityAndLabel[statut].label}
  </Badge>
);
