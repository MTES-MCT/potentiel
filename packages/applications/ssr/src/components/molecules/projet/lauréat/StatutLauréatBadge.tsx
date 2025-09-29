import { AlertProps } from '@codegouvfr/react-dsfr/Alert';
import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { Lauréat } from '@potentiel-domain/projet';

const convertStatutLauréatToBadgeSeverity: Record<
  StatutLauréatBadgeProps['statut'],
  AlertProps.Severity
> = {
  actif: 'success',
  abandonné: 'warning',
  achevé: 'success',
};

type StatutLauréatBadgeProps = {
  statut: Lauréat.StatutLauréat.RawType;
};

export const StatutLauréatBadge: FC<StatutLauréatBadgeProps> = ({ statut }) => (
  <>
    <Badge
      small
      noIcon
      severity={convertStatutLauréatToBadgeSeverity[statut]}
      className="print:hidden"
    >
      {statut}
    </Badge>
    <div className="hidden print:block text-theme-black ">{statut}</div>
  </>
);
