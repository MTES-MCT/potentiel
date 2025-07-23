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
    {getText(statut)}
  </Badge>
);

const getSeverity = (statut: StatutChangementReprésentantLégalBadgeProps['statut']) =>
  match(statut)
    .returnType<BadgeProps['severity']>()
    .with(P.union('demandé', 'information-enregistrée'), () => 'new')
    .with('accordé', () => 'success')
    .with(P.union('rejeté', 'annulé'), () => 'warning')
    .exhaustive();

const getText = (statut: StatutChangementReprésentantLégalBadgeProps['statut']) =>
  match(statut)
    .with('information-enregistrée', () => 'information enregistrée')
    .otherwise(() => statut);
