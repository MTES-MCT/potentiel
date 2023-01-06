import { UserRole } from '@modules/users'

export const donnéesProjetParCatégorie: Record<string, string[]> = {
  'identification projet': [
    'numeroCRE',
    'appelOffreId',
    'periodeId',
    'familleId',
    'nomProjet',
    'technologie',
  ],
  'résultat instruction': ['classe', 'statut', 'motifElimination'],
}

const permissionsAdmin = ['identification projet', 'candidat']

export const catégoriesPermissionsParRôle: Record<UserRole, string[]> = {
  admin: permissionsAdmin,
  'dgec-validateur': permissionsAdmin,
  dreal: [''],
  'porteur-projet': [''],
  'acheteur-obligé': [''],
  ademe: [''],
  cre: [''],
  'caisse-des-dépôts': [''],
}
