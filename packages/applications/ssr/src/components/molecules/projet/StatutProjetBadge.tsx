import { AlertProps } from '@codegouvfr/react-dsfr/Alert';
import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

export type StatutProjet = 'non-notifié' | 'abandonné' | 'classé' | 'éliminé';

const convertStatutProjetToBadgeSeverity: Record<StatutProjet, AlertProps.Severity> = {
  classé: 'success',
  abandonné: 'warning',
  'non-notifié': 'info',
  éliminé: 'error',
};

export const StatutProjetBadge: FC<{ statut: StatutProjet }> = ({ statut }) => (
  <Badge small noIcon severity={convertStatutProjetToBadgeSeverity[statut]}>
    {statut}
  </Badge>
);
