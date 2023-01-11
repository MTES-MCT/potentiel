import { getListeColonnesExportParRole } from './getListeColonnesExportParRole'

describe(`getListeColonnesExportParRole`, () => {
  const donnéesProjetParCatégorie: Record<string, string[]> = {
    'identification projet': ['numeroCre', 'appelOffreId'],
    candidat: ['nomProjet', 'actionnaire'],
  }

  const permissionsDGEC = ['identification projet', 'candidat']

  const catégoriesPermissionsParRôle = {
    admin: permissionsDGEC,
    'dgec-validateur': permissionsDGEC,
  }

  it(`Etant donné un role admin,
  alors un tableau de données devrait être retourné`, () => {
    const result = getListeColonnesExportParRole({
      role: 'admin',
      donnéesProjetParCatégorie,
      catégoriesPermissionsParRôle,
    })
    expect(result).toEqual(['numeroCre', 'appelOffreId', 'nomProjet', 'actionnaire'])
  })
})
