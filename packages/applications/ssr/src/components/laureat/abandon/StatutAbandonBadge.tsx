import Badge, { BadgeProps } from '@codegouvfr/react-dsfr/Badge';
import { Abandon } from '@potentiel-domain/laureat';

export type StatutAbandonBadgeProps = {
  statut: Abandon.ConsulterAbandonReadModel['statut'];
};

export const StatutAbandonBadge = ({ statut }: StatutAbandonBadgeProps) => {
  const severity: BadgeProps['severity'] = (() => {
    switch (statut) {
      case 'accordé':
        return 'success';
      case 'rejeté':
        return 'error';
      case 'confirmation-demandée':
        return 'warning';
      default:
        return 'info';
    }
  })();

  return (
    <Badge noIcon severity={severity}>
      {statut.replace('-', ' ').toLocaleUpperCase()}
    </Badge>
  );
};
