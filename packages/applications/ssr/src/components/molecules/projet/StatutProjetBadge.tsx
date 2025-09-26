import { AlertProps } from '@codegouvfr/react-dsfr/Alert';
import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { Candidature, Lauréat } from '@potentiel-domain/projet';

const convertStatutProjetToBadgeSeverity: Record<
  StatutProjetBadgeProps['statut'],
  AlertProps.Severity
> = {
  actif: 'success',
  classé: 'success',
  abandonné: 'warning',
  achevé: 'success',
  'non-notifié': 'info',
  éliminé: 'error',
};

const getStatutProjetBadgeLabel = (statut: StatutProjetBadgeProps['statut']): string => {
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

type StatutProjetBadgeProps = {
  statut:
    | Lauréat.StatutLauréat.RawType
    | Candidature.StatutCandidature.RawType
    | 'éliminé'
    | 'non-notifié';
  actionnariat?: Candidature.TypeActionnariat.RawType;
};

export const StatutProjetBadge: FC<StatutProjetBadgeProps> = ({ statut, actionnariat }) => (
  <>
    <Badge
      small
      noIcon
      severity={convertStatutProjetToBadgeSeverity[statut]}
      className="print:hidden"
    >
      {getStatutProjetBadgeLabel(statut)}
      {getTypeActionnariat(actionnariat) && ` (${getTypeActionnariat(actionnariat)})`}
    </Badge>
    <div className="hidden print:block text-theme-black ">
      {getStatutProjetBadgeLabel(statut)}
      {getTypeActionnariat(actionnariat) && ` (${getTypeActionnariat(actionnariat)})`}
    </div>
  </>
);
