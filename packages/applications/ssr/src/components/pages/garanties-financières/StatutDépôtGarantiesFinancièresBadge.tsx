import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { DépôtStatut } from './détails/components/HistoriqueDesGarantiesFinancièresDéposées';

export type StatutDépôtGarantiesFinancièresBadgProps = {
  statut: DépôtStatut;
};

const getSeverity = (statut: DépôtStatut) => {
  switch (statut) {
    case 'en-cours':
      return 'info';
    case 'validé':
      return 'success';
    case 'rejeté':
      return 'error';
  }
};

export const StatutDépôtGarantiesFinancièresBadge: FC<StatutDépôtGarantiesFinancièresBadgProps> = ({
  statut,
}) => (
  <Badge noIcon severity={getSeverity(statut)} small={true}>
    {statut.replace(/-/g, ' ')}
  </Badge>
);
