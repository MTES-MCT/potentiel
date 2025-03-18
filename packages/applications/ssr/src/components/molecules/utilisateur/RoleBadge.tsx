import { AlertProps } from '@codegouvfr/react-dsfr/Alert';
import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { Role } from '@potentiel-domain/utilisateur';

import { roleToLabel } from '@/utils/utilisateur/format-role';

const roleToSeverity: Record<Role.RawType, AlertProps.Severity> = {
  admin: 'error',
  'dgec-validateur': 'error',

  'porteur-projet': 'info',
  dreal: 'success',

  'acheteur-obligé': 'warning',
  ademe: 'warning',
  'caisse-des-dépôts': 'warning',
  cre: 'warning',
  grd: 'warning',
};

export const RoleBadge: FC<{
  role: Role.RawType;
}> = ({ role }) => (
  <Badge small noIcon severity={roleToSeverity[role]}>
    {roleToLabel[role]}
  </Badge>
);
