import Badge, { BadgeProps } from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';
import { match, P } from 'ts-pattern';

import { Actionnaire } from '@potentiel-domain/laureat';

export type StatutChangementActionnaireBadgeProps = {
  statut: Actionnaire.StatutChangementActionnaire.RawType;
  small?: true;
};
export const StatutChangementActionnaireBadge: FC<StatutChangementActionnaireBadgeProps> = ({
  statut,
  small,
}) => (
  <Badge noIcon severity={getSeverity(statut)} small={small}>
    {statut}
  </Badge>
);

const getSeverity = (statut: StatutChangementActionnaireBadgeProps['statut']) =>
  match(statut)
    .returnType<BadgeProps['severity']>()
    .with('demandé', () => 'new')
    .with('annulé', () => 'info')
    .with('rejeté', () => 'warning')
    .with(P.union('accordé', 'information-enregistrée'), () => 'success')
    .exhaustive();
