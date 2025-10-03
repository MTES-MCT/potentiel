import { AlertProps } from '@codegouvfr/react-dsfr/Alert';
import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { Candidature } from '@potentiel-domain/projet';

const convertStatutCandidatureToBadgeSeverity: Record<
  StatutCandidatureBadgeProps['statut'],
  AlertProps.Severity
> = {
  classé: 'success',
  'non-notifié': 'info',
  éliminé: 'error',
};

const getStatutCandidatureBadgeLabel = (statut: StatutCandidatureBadgeProps['statut']): string => {
  if (statut === 'non-notifié') return 'à notifier';
  return statut;
};

type StatutCandidatureBadgeProps = {
  statut: Candidature.StatutCandidature.RawType | 'non-notifié';
};

export const StatutCandidatureBadge: FC<StatutCandidatureBadgeProps> = ({ statut }) => (
  <>
    <Badge
      small
      noIcon
      severity={convertStatutCandidatureToBadgeSeverity[statut]}
      className="print:hidden"
    >
      {getStatutCandidatureBadgeLabel(statut)}
    </Badge>
    <div className="hidden print:block text-theme-black ">
      {getStatutCandidatureBadgeLabel(statut)}
    </div>
  </>
);
