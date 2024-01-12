import { FC } from 'react';
import Badge from '@codegouvfr/react-dsfr/Badge';

export type PreuveRecandidatureStatutBadgeProps = {
  statut: 'transmise' | 'en-attente' | 'non-applicable';
  small?: true;
};
export const PreuveRecandidatureStatutBadge: FC<PreuveRecandidatureStatutBadgeProps> = ({
  statut,
  small,
}) => (
  <>
    {statut === 'transmise' || statut === 'en-attente' ? (
      <Badge noIcon severity={statut === 'transmise' ? 'success' : 'warning'} small={small}>
        {statut === 'transmise'
          ? 'preuve de recandidature transmise'
          : 'preuve de recandidature en attente'}
      </Badge>
    ) : (
      ''
    )}
  </>
);
