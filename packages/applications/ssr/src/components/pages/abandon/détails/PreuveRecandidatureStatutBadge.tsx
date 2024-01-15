import { FC } from 'react';
import Badge from '@codegouvfr/react-dsfr/Badge';
import { Abandon } from '@potentiel-domain/laureat';

export type StatutPreuveRecandidatureBadgeProps = {
  statut: Abandon.StatutPreuveRecandidature.RawType;
  small?: true;
};
export const StatutPreuveRecandidatureBadge: FC<StatutPreuveRecandidatureBadgeProps> = ({
  statut,
  small,
}) =>
  (statut === 'transmise' || statut === 'en-attente') && (
    <Badge noIcon severity={statut === 'transmise' ? 'success' : 'warning'} small={small}>
      {statut === 'transmise'
        ? 'preuve de recandidature transmise'
        : 'preuve de recandidature en attente'}
    </Badge>
  );
