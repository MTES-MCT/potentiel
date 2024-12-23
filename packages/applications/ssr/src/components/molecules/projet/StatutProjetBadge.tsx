import { AlertProps } from '@codegouvfr/react-dsfr/Alert';
import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { Candidature } from '@potentiel-domain/candidature';
import { StatutProjet } from '@potentiel-domain/common';

const convertStatutProjetToBadgeSeverity: Record<StatutProjet.RawType, AlertProps.Severity> = {
  classé: 'success',
  abandonné: 'warning',
  'non-notifié': 'info',
  éliminé: 'error',
};

const getStatutProjetBadgeLabel = (statut: StatutProjet.RawType): string => {
  if (statut === 'non-notifié') return 'à notifier';
  return statut;
};

const getFinancementType = (actionnariat?: Candidature.TypeActionnariat.RawType) =>
  actionnariat
    ? actionnariat
        .split('-')
        .map((word) => word[0].toUpperCase())
        .join('')
    : undefined;

export const StatutProjetBadge: FC<{
  statut: StatutProjet.RawType;
  actionnariat?: Candidature.TypeActionnariat.RawType;
}> = ({ statut, actionnariat }) => (
  <Badge small noIcon severity={convertStatutProjetToBadgeSeverity[statut]}>
    {getStatutProjetBadgeLabel(statut)}
    {getFinancementType(actionnariat) && ` (${getFinancementType(actionnariat)})`}
  </Badge>
);
