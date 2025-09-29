import { AlertProps } from '@codegouvfr/react-dsfr/Alert';
import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { Candidature, Lauréat } from '@potentiel-domain/projet';

const convertStatutLauréatToBadgeSeverity: Record<
  StatutLauréatBadgeProps['statut'],
  AlertProps.Severity
> = {
  actif: 'success',
  abandonné: 'warning',
  achevé: 'success',
};

const getTypeActionnariat = (actionnariat?: Candidature.TypeActionnariat.RawType) =>
  actionnariat
    ? actionnariat
        .split('-')
        .map((word) => word[0].toUpperCase())
        .join('')
    : undefined;

type StatutLauréatBadgeProps = {
  statut: Lauréat.StatutLauréat.RawType;
  actionnariat?: Candidature.TypeActionnariat.RawType;
};

export const StatutLauréatBadge: FC<StatutLauréatBadgeProps> = ({ statut, actionnariat }) => (
  <>
    <Badge
      small
      noIcon
      severity={convertStatutLauréatToBadgeSeverity[statut]}
      className="print:hidden"
    >
      {statut}
      {getTypeActionnariat(actionnariat) && ` (${getTypeActionnariat(actionnariat)})`}
    </Badge>
    <div className="hidden print:block text-theme-black ">
      {statut}
      {getTypeActionnariat(actionnariat) && ` (${getTypeActionnariat(actionnariat)})`}
    </div>
  </>
);
