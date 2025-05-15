import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { Role } from '@potentiel-domain/utilisateur';

import { roleToLabel } from '@/utils/utilisateur/format-role';

export const RoleBadge: FC<{
  role: Role.RawType;
}> = ({ role }) => (
  <Badge small noIcon severity="info">
    {roleToLabel[role]}
  </Badge>
);
