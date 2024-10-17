import Badge, { BadgeProps } from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';
import { match } from 'ts-pattern';

export type StatutReprésentantLégalBadgeProps = {
  /**
   * @todo À ajouter quand domain est prêt :
  statut: ReprésentantLégal.StatutReprésentantLégal.RawType;
  */
  statut: 'demandé' | 'accordé' | 'rejeté' | 'annulé';
  small?: true;
};
export const StatutReprésentantLégalBadge: FC<StatutReprésentantLégalBadgeProps> = ({
  statut,
  small,
}) => (
  <Badge noIcon severity={getSeverity(statut)} small={small}>
    {statut}
  </Badge>
);

const getSeverity = (statut: StatutReprésentantLégalBadgeProps['statut']) =>
  match(statut)
    .returnType<BadgeProps['severity']>()
    .with('demandé', () => 'new')
    .with('accordé', () => 'success')
    .with('rejeté', () => 'warning')
    .with('annulé', () => 'warning')
    .exhaustive();
