import { Role } from '@potentiel-domain/utilisateur';

export const roleToLabel: Record<Role.RawType, string> = {
  admin: 'Admin',
  'porteur-projet': 'Porteur de projet',
  dreal: 'DREAL',
  'acheteur-obligé': 'Acheteur Obligé',
  ademe: 'Ademe',
  'dgec-validateur': 'DGEC Validateur',
  'caisse-des-dépôts': 'Caisse des dépôts',
  cre: 'CRE',
  grd: 'Gestionnaire de Réseau',
};

export const listeDesRoleSaufPorteur = [
  { value: Role.admin.nom, label: roleToLabel[Role.admin.nom] },
  { value: Role.dreal.nom, label: roleToLabel[Role.dreal.nom] },
  { value: Role.grd.nom, label: roleToLabel[Role.grd.nom] },
  { value: Role.dgecValidateur.nom, label: roleToLabel[Role.dgecValidateur.nom] },
  { value: Role.ademe.nom, label: roleToLabel[Role.ademe.nom] },
  { value: Role.acheteurObligé.nom, label: roleToLabel[Role.acheteurObligé.nom] },
  { value: Role.cre.nom, label: roleToLabel[Role.cre.nom] },
  { value: Role.caisseDesDépôts.nom, label: roleToLabel[Role.caisseDesDépôts.nom] },
];

export const listeDesRoles = [
  ...listeDesRoleSaufPorteur,
  { value: Role.porteur.nom, label: roleToLabel[Role.porteur.nom] },
];
