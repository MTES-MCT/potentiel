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

const getTypeActionnariat = (actionnariat?: Candidature.TypeActionnariat.RawType) =>
  actionnariat
    ? actionnariat
        .split('-')
        .map((word) => word[0].toUpperCase())
        .join('')
    : undefined;

type StatutCandidatureBadgeProps = {
  statut: Candidature.StatutCandidature.RawType | 'non-notifié';
  actionnariat?: Candidature.TypeActionnariat.RawType;
};

export const StatutCandidatureBadge: FC<StatutCandidatureBadgeProps> = ({
  statut,
  actionnariat,
}) => (
  <>
    <Badge
      small
      noIcon
      severity={convertStatutCandidatureToBadgeSeverity[statut]}
      className="print:hidden"
    >
      {getStatutCandidatureBadgeLabel(statut)}
      {getTypeActionnariat(actionnariat) && ` (${getTypeActionnariat(actionnariat)})`}
    </Badge>
    <div className="hidden print:block text-theme-black ">
      {getStatutCandidatureBadgeLabel(statut)}
      {getTypeActionnariat(actionnariat) && ` (${getTypeActionnariat(actionnariat)})`}
    </div>
  </>
);
