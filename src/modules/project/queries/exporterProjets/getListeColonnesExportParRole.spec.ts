import { getListeColonnesExportParRole } from './getListeColonnesExportParRole'

describe(`getListeColonnesExportParRole`, () => {
  const donnéesProjetParCatégorie: Record<string, string[]> = {
    'identification projet': ['numeroCre', 'appelOffreId'],
    candidat: ['nomProjet', 'actionnaire'],
  }

  const permissionsAdmin = ['identification projet', 'candidat']

  const permissionDreal = ['identification projet']

  const permissionDéfaut = ['']

  const catégoriesPermissionsParRôle = {
    admin: permissionsAdmin,
    dreal: permissionDreal,
    'dgec-validateur': permissionsAdmin,
    'porteur-projet': permissionDéfaut,
    'acheteur-obligé': permissionDéfaut,
    ademe: permissionDéfaut,
    cre: permissionDéfaut,
    'caisse-des-dépôts': permissionDéfaut,
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
