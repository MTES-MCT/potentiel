import { json } from 'sequelize'
import { getListeColonnesExportParRole } from './getListeColonnesExportParRole'

describe(`getListeColonnesExportParRole`, () => {
  it(`Etant donné un rôle admin,
  alors un tableau des données devrait être retourné`, () => {
    const result = getListeColonnesExportParRole({
      role: 'admin',
    })
    expect(result).toEqual(
      expect.arrayContaining([
        { champ: 'numeroCRE', intitulé: 'N°CRE' },
        { champ: 'appelOffreId', intitulé: "Appel d'offres" },
        { champ: 'periodeId', intitulé: 'Période' },
        { champ: 'familleId', intitulé: 'Famille' },
        {
          champ: json(`details->>'Nom et prénom du contact'`),
          intitulé: 'Nom et prénom du contact',
        },
        { champ: json(`details->>'Titre du contact'`), intitulé: 'Titre du contact' },
      ])
    )
  })
})
