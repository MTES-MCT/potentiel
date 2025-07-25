import { AlertProps } from '@codegouvfr/react-dsfr/Alert';
import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { Candidature, StatutProjet } from '@potentiel-domain/projet';

const convertStatutProjetToBadgeSeverity: Record<
  StatutProjet.RawType | 'non-notifié',
  AlertProps.Severity
> = {
  classé: 'success',
  abandonné: 'warning',
  achevé: 'success',
  'non-notifié': 'info',
  éliminé: 'error',
};

const getStatutProjetBadgeLabel = (statut: StatutProjet.RawType | 'non-notifié'): string => {
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

export const StatutProjetBadge: FC<{
  statut: StatutProjet.RawType | 'non-notifié';
  actionnariat?: Candidature.TypeActionnariat.RawType;
}> = ({ statut, actionnariat }) => (
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
