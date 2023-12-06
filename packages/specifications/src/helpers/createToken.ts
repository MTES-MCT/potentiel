import { sign } from 'jsonwebtoken';

type TokenOptions = {
  email: string;
  role: string;
};

export const createToken = ({ email, role }: TokenOptions) => {
  const expiresIn = '1h';

  return sign(
    {
      email,
      name: 'nom',
      realm_access: {
        roles: [getRole(role)],
      },
    },
    null,
    {
      expiresIn,
      algorithm: 'none',
    },
  );
};

const getRole = (roleUtilisateur: string) => {
  switch (roleUtilisateur) {
    case `l'administrateur`:
      return 'admin';
    case `l'acheteur obligé`:
      return 'acheteur-obligé';
    case `l'ADEME`:
      return 'ademe';
    case `la caisse des dépôts`:
      return 'caisse-des-dépôts';
    case `la CRE`:
      return 'cre';
    case `la DREAL`:
      return 'dreal';
    case `le DGEC validateur`:
      return 'dgec-validateur';
    case `le porteur`:
      return 'porteur-projet';
    default:
      return 'inconnu';
  }
};
