import Badge, { BadgeProps } from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';
import { match } from 'ts-pattern';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

export type StatutChangementReprésentantLégalBadgeProps = {
  statut: ReprésentantLégal.StatutChangementReprésentantLégal.RawType;
  small?: true;
};
export const StatutChangementReprésentantLégalBadge: FC<
  StatutChangementReprésentantLégalBadgeProps
> = ({ statut, small }) => (
  <Badge noIcon severity={getSeverity(statut)} small={small}>
    {statut}
  </Badge>
);

const getSeverity = (statut: StatutChangementReprésentantLégalBadgeProps['statut']) =>
  match(statut)
    .returnType<BadgeProps['severity']>()
    .with('demandé', () => 'new')
    .with('accordé', () => 'success')
    .with('rejeté', () => 'warning')
    .exhaustive();
