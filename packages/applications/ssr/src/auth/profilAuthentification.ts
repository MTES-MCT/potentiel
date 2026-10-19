import type { Role } from '@potentiel-domain/utilisateur';

export type ProfilAuthentification = 'agents' | 'porteurs' | 'partenaires';

const profilMap: Record<Role.RawType, ProfilAuthentification> = {
  // Agents
  admin: 'agents',
  ademe: 'agents',
  'dgec-validateur': 'agents',
  dgec: 'agents',
  dreal: 'agents',

  // Porteurs
  'porteur-projet': 'porteurs',
  visiteur: 'porteurs',

  // Partenaires
  cre: 'partenaires',
  'caisse-des-dépôts': 'partenaires',
  cocontractant: 'partenaires',
  grd: 'partenaires',
};

export const getProfilAuthentification = (role: Role.RawType): ProfilAuthentification =>
  profilMap[role];
