import { resetDatabase } from '@infra/sequelize/helpers'
import { ConnexionsParProjetEtParRoleParJour } from '@infra/sequelize/tableModels'
import { mettreAJourConnexionsParProjetEtParRoleParJour } from './mettreAJourConnexionsParProjetEtParRoleParJour'

describe(`Mettre à jour le nombre de connexion par projet, par rôle et par jour`, () => {
  const date = new Date('2022-01-01')
  const projet = 'fcdfc1fc-9e90-4776-a655-80406468a61c'
  beforeEach(async () => await resetDatabase())

  it(`Étant donnée qu'aucune connexion n'a été faite le 01/01/2022 pour le projet 'fcdfc1fc-9e90-4776-a655-80406468a61c' pour le rôle admin
      Lorsqu'un utilisateur admin se rend sur le projet 'fcdfc1fc-9e90-4776-a655-80406468a61c' le 01/01/2022
      Alors le compteur devrait être de 1 pour ce rôle et ce projet`, async () => {
    await mettreAJourConnexionsParProjetEtParRoleParJour({ role: 'admin', date, projet })
    const entrée = await ConnexionsParProjetEtParRoleParJour.findOne({
      where: { role: 'admin', projet },
    })
    expect(entrée?.compteur).toEqual(1)
    expect(entrée?.projet).toEqual(projet)
  })

  it(`Étant donnée une visite faite le 01/01/2022 pour le projet 'fcdfc1fc-9e90-4776-a655-80406468a61c' pour le rôle admin
        Lorsqu'un utilisateur admin se rend sur le projet 'fcdfc1fc-9e90-4776-a655-80406468a61c' le 01/01/2022
        Alors le compteur devrait être de 2 pour ce rôle et ce projet`, async () => {
    const entréeInitiale = await ConnexionsParProjetEtParRoleParJour.create({
      role: 'admin',
      date,
      projet,
      compteur: 1,
    })
    await mettreAJourConnexionsParProjetEtParRoleParJour({ role: 'admin', projet, date })
    const entrée = await ConnexionsParProjetEtParRoleParJour.findOne({
      where: { id: entréeInitiale.id },
    })
    expect(entrée?.compteur).toEqual(2)
  })
})
