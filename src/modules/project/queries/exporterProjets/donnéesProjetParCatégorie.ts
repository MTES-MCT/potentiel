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

const permissionsDGEC = ['identification projet', 'candidat']

const rolesPourCatégoriesPermission = ['admin', 'dgec-validateur'] as const
export type RolesPourCatégoriesPermission = typeof rolesPourCatégoriesPermission[number]
// à terme 'Roles' sera remplace par le type existant UserRoles

export const catégoriesPermissionsParRôle: Record<RolesPourCatégoriesPermission, string[]> = {
  admin: permissionsDGEC,
  'dgec-validateur': permissionsDGEC,
}
