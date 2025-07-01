import Badge, { BadgeProps } from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';
import { match, P } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

export type StatutChangementReprésentantLégalBadgeProps = {
  statut: Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.RawType;
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
    .with(P.union('rejeté', 'annulé'), () => 'warning')
    .exhaustive();
