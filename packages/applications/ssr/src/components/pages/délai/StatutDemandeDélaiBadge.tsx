import Badge, { BadgeProps } from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';
import { match, P } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

export type StatutDemandeDélaiBadgeProps = {
  statut: Lauréat.Délai.StatutDemandeDélai.RawType;
  small?: true;
};
export const StatutDemandeDélaiBadge: FC<StatutDemandeDélaiBadgeProps> = ({ statut, small }) => (
  <Badge noIcon severity={getSeverity(statut)} small={small}>
    {getText(statut)}
  </Badge>
);

const getSeverity = (statut: StatutDemandeDélaiBadgeProps['statut']) =>
  match(statut)
    .returnType<BadgeProps['severity']>()
    .with(P.union('demandé', 'en-instruction'), () => 'new')
    .with('annulé', () => 'info')
    .with('rejeté', () => 'warning')
    .with('accordé', () => 'success')
    .exhaustive();

const getText = (statut: StatutDemandeDélaiBadgeProps['statut']) =>
  match(statut)
    .with('en-instruction', () => 'en instruction')
    .otherwise(() => statut);
