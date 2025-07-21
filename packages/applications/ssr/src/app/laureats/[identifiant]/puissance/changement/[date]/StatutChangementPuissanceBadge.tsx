import Badge, { BadgeProps } from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';
import { match, P } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

export type StatutChangementPuissanceBadgeProps = {
  statut: Lauréat.Puissance.StatutChangementPuissance.RawType;
  small?: true;
};
export const StatutChangementPuissanceBadge: FC<StatutChangementPuissanceBadgeProps> = ({
  statut,
  small,
}) => (
  <Badge noIcon severity={getSeverity(statut)} small={small}>
    {getText(statut)}
  </Badge>
);

const getSeverity = (statut: StatutChangementPuissanceBadgeProps['statut']) =>
  match(statut)
    .returnType<BadgeProps['severity']>()
    .with('demandé', () => 'new')
    .with('annulé', () => 'info')
    .with('rejeté', () => 'warning')
    .with(P.union('accordé', 'information-enregistrée'), () => 'success')
    .exhaustive();

const getText = (statut: StatutChangementPuissanceBadgeProps['statut']) =>
  match(statut)
    .with('information-enregistrée', () => 'information enregistrée')
    .otherwise(() => statut);
