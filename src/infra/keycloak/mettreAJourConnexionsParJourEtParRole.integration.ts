import { resetDatabase } from '@infra/sequelize/helpers'
import { ConnexionsParRoleEtParJour } from '@infra/sequelize/tableModels'
import { mettreAJourConnexionsParJourEtParRole } from './mettreAJourConnexionsParJourEtParRole'

describe(`helper mettreAJourConnexionsParJourEtParRole`, () => {
  const date = new Date('2022-01-01')
  beforeEach(async () => await resetDatabase())
  describe(`Lorsqu'il n'y a pas d'entrée dans la table ConnexionsParJourEtParRole pour le rôle à la date du jour`, () => {
    it(`Alors, une nouvelle entrée devrait être insérée dans la table ConnexionParJourEtParRole`, async () => {
      await resetDatabase()

      await mettreAJourConnexionsParJourEtParRole({ role: 'admin', date })
      const entrée = await ConnexionsParRoleEtParJour.findOne({ where: { role: 'admin' } })
      expect(entrée?.compteur).toEqual(1)
      expect(entrée).not.toBeNull()
    })
  })

  describe(`Lorsqu'il y a déjà une entrée dans la table ConnexionsParJourEtParRole pour le rôle à la date du jour`, () => {
    it(`Alors, le compteur de cette entrée devrait être incrémenté`, async () => {
      await resetDatabase()
      const entréeInitiale = await ConnexionsParRoleEtParJour.create({
        role: 'admin',
        date: '2022-01-01',
        compteur: 1,
      })

      await mettreAJourConnexionsParJourEtParRole({ role: 'admin', date })

      const entrée = await ConnexionsParRoleEtParJour.findOne({ where: { id: entréeInitiale.id } })

      console.log(entrée)

      expect(entrée?.compteur).toEqual(2)
    })
  })
})
