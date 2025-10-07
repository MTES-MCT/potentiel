import Badge, { BadgeProps } from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { Éliminé } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

export type StatutDemandeBadgeProps = {
  statut:
    | Lauréat.Abandon.StatutAbandon.RawType
    | Éliminé.Recours.StatutRecours.RawType
    | Lauréat.Puissance.StatutChangementPuissance.RawType
    | Lauréat.Actionnaire.StatutChangementActionnaire.RawType
    | Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.RawType
    | 'information-enregistrée';
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
