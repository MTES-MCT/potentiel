import { FC } from 'react';
import Badge from '@codegouvfr/react-dsfr/Badge';

export type PreuveRecandidatureStatutBadgeProps = {
  statut: 'transmise' | 'en-attente';
  small?: true;
};
export const PreuveRecandidatureStatutBadge: FC<PreuveRecandidatureStatutBadgeProps> = ({
  statut,
  small,
}) => (
  <Badge noIcon severity={statut === 'transmise' ? 'info' : 'warning'} small={small}>
    {statut === 'transmise'
      ? 'preuve de recandidature transmise'
      : 'preuve de recandidature en attente'}
  </Badge>
);
