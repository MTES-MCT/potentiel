import { resetDatabase } from '@infra/sequelize/helpers'
import { ConnexionsParRoleEtParJour } from '@infra/sequelize/tableModels'
import { mettreAJourConnexionsParRoleEtParJour } from './mettreAJourConnexionsParRoleEtParJour'

describe(`Mettre à jour le nombre de connexion par rôle et par jour`, () => {
  const date = new Date('2022-01-01')
  beforeEach(async () => await resetDatabase())
  it(`Étant donné qu'aucune connexion n'a été faite le 01/01/2022 pour le rôle admin
      Lorsqu'un utilisateur avec le rôle admin se connecte le 01/01/2022
      Alors le compteur de connexion devrait être de 1 pour ce rôle et ce jour`, async () => {
    await mettreAJourConnexionsParRoleEtParJour({ role: 'admin', date })
    const entrée = await ConnexionsParRoleEtParJour.findOne({ where: { role: 'admin' } })
    expect(entrée?.compteur).toEqual(1)
    expect(entrée?.date).toEqual('2022-01-01')
  })

  it(`Étant donné une connexion faite le 01/01/2022 pour le rôle admin
      Lorsqu'un utilisateur avec le rôle admin se connecte le 01/01/2022
      Alors le compteur de connexion devrait être de 2 pour ce rôle et ce jour`, async () => {
    const entréeInitiale = await ConnexionsParRoleEtParJour.create({
      role: 'admin',
      date: new Date('2022-01-01'),
      compteur: 1,
    })

    await mettreAJourConnexionsParRoleEtParJour({ role: 'admin', date })

    const entrée = await ConnexionsParRoleEtParJour.findOne({ where: { id: entréeInitiale.id } })

    expect(entrée?.compteur).toEqual(2)
  })
})
