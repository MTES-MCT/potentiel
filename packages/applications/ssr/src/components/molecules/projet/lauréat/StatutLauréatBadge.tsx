import type { AlertProps } from '@codegouvfr/react-dsfr/Alert';
import Badge from '@codegouvfr/react-dsfr/Badge';
import type { FC } from 'react';

import type { Lauréat } from '@potentiel-domain/projet';

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
    <Badge small noIcon severity={convertStatutLauréatToBadgeSeverity[statut]}>
      {statut}
    </Badge>
  </>
);
