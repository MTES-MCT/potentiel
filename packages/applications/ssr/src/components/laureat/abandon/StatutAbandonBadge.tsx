'use server';
import Badge, { BadgeProps } from '@codegouvfr/react-dsfr/Badge';
import { Abandon } from '@potentiel-domain/laureat';

export type StatutAbandonBadgeProps = {
  statut: Abandon.ConsulterAbandonReadModel['statut'];
};

export const StatutAbandonBadge = ({ statut }: StatutAbandonBadgeProps) => {
  const severity: BadgeProps['severity'] = (() => {
    if (statut.estAccordé()) return 'success';
    if (statut.estRejeté()) return 'error';
    if (statut.estConfirmationDemandée()) return 'warning';

    return 'info';
  })();

  return (
    <Badge noIcon severity={severity}>
      {statut.libellé()}
    </Badge>
  );
};
