import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { Abandon } from '@potentiel-domain/laureat';

export type StatutPreuveRecandidatureBadgeProps = {
  statut: Abandon.StatutPreuveRecandidature.RawType;
  small?: true;
};
export const StatutPreuveRecandidatureBadge: FC<StatutPreuveRecandidatureBadgeProps> = ({
  statut,
  small,
}) =>
  (statut === 'transmis' || statut === 'en-attente') && (
    <Badge noIcon severity={statut === 'transmis' ? 'success' : 'warning'} small={small}>
      {statut === 'transmis'
        ? 'preuve de recandidature transmise'
        : 'preuve de recandidature en attente'}
    </Badge>
  );
