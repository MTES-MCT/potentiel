import { Role } from '@potentiel-domain/utilisateur';

export const roleToLabel: Record<Role.RawType, string> = {
  admin: 'Admin',
  'porteur-projet': 'Porteur de projet',
  dreal: 'DREAL',
  cocontractant: 'Cocontractant',
  ademe: 'Ademe',
  'dgec-validateur': 'DGEC Validateur',
  'caisse-des-dépôts': 'Caisse des dépôts',
  cre: 'CRE',
  grd: 'Gestionnaire de Réseau',
};

export const listeDesRoles = Role.roles
  .map((role) => ({ value: role, label: roleToLabel[role] }))
  .sort((a, b) => a.label.localeCompare(b.label));

export const listeDesRolesSaufPorteur = [
  ...listeDesRoles.filter(({ value }) => value !== Role.porteur.nom),
];
