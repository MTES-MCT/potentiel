import { resetDatabase } from '@infra/sequelize/helpers'
import { ConnexionsParRoleEtParJour } from '@infra/sequelize/tableModels'
import { mettreAJourConnexionsParRoleEtParJour } from './mettreAJourConnexionsParRoleEtParJour'

describe(`helper mettreAJourConnexionsParRoleEtParJour`, () => {
  const date = new Date('2022-01-01')
  beforeEach(async () => await resetDatabase())
  describe(`Lorsqu'il n'y a pas d'entrée dans la table ConnexionsParRoleEtParJour pour le rôle à la date du jour`, () => {
    it(`Alors, une nouvelle entrée devrait être insérée dans la table ConnexionsParRoleEtParJour`, async () => {
      await mettreAJourConnexionsParRoleEtParJour({ role: 'admin', date })
      const entrée = await ConnexionsParRoleEtParJour.findOne({ where: { role: 'admin' } })
      expect(entrée?.compteur).toEqual(1)
      expect(entrée?.date).toEqual('2022-01-01')
    })
  })

  describe(`Lorsqu'il y a déjà une entrée dans la table ConnexionsParRoleEtParJour pour le rôle à la date du jour`, () => {
    it(`Alors, le compteur de cette entrée devrait être incrémenté`, async () => {
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
})
