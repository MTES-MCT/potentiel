import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { Role } from '@potentiel-domain/utilisateur';

import { roleToLabel } from '@/utils/utilisateur/format-role';

type RoleBadgeProps = {
  role: Role.RawType;
};

export const RoleBadge: FC<RoleBadgeProps> = ({ role }) => (
  <Badge small noIcon severity="info">
    {roleToLabel[role]}
  </Badge>
);
