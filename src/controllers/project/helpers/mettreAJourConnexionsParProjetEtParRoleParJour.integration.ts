import { resetDatabase } from '@infra/sequelize/helpers'
import { ConnexionsParProjetEtParRoleParJour } from '@infra/sequelize/tableModels'
import { mettreAJourConnexionsParProjetEtParRoleParJour } from './mettreAJourConnexionsParProjetEtParRoleParJour'

describe(`helper mettreAJourConnexionsParProjetEtParRoleParJour`, () => {
  const date = new Date('2022-01-01')
  const projet = 'fcdfc1fc-9e90-4776-a655-80406468a61c'
  beforeEach(async () => await resetDatabase())

  describe(`Lorsqu'il n'y a pas d'entrée dans la table ConnexionsParProjetEtParRoleParJour pour le projet et le rôle à la date du jour`, () => {
    it(`Alors, une nouvelle entrée devrait être insérée dans la table ConnexionsParProjetEtParRoleParJour`, async () => {
      await mettreAJourConnexionsParProjetEtParRoleParJour({ role: 'admin', date, projet })
      const entrée = await ConnexionsParProjetEtParRoleParJour.findOne({
        where: { role: 'admin', projet },
      })
      expect(entrée?.compteur).toEqual(1)
      expect(entrée?.projet).toEqual(projet)
    })
  })

  describe(`Lorsqu'il y a déjà une entrée dans la table ConnexionsParProjetEtParRoleParJour pour le projet et le rôle à la date du jour`, () => {
    it(`Alors, le compteur de cette entrée devrait être incrémenté`, async () => {
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
})
