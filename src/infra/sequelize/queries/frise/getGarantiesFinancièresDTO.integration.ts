import { getGarantiesFinancièresDTO } from './getGarantiesFinancièresDTO'
import { models } from '../../models'
import { resetDatabase } from '@infra/sequelize/helpers'
import { UniqueEntityID } from '@core/domain'
import { User } from '@entities'
import { GarantiesFinancières } from '@infra/sequelize/projectionsNext/garantiesFinancières'

describe(`Requête getGarantiesFinancièresDTO`, () => {
  const { File, User } = models
  const projetId = new UniqueEntityID().toString()
  const utilisateurAutorisé = { role: 'admin' } as User
  const dateLimiteEnvoi = new Date('2023-01-01')
  const dateEchéance = new Date()
  const envoyéesPar = new UniqueEntityID().toString()
  const dateConstitution = new Date()
  const fichierId = new UniqueEntityID().toString()

  beforeEach(async () => await resetDatabase())

  describe(`Retourner les données de GF en retard`, () => {
    it(`Etant donné un projet soumis à garanties financières,
  et dont les GF sont en attente avec une date limite d'envoi dépassée,
  alors la requête devrait retourner un GarantiesFinancièresDTO 
  avec un statut 'en en retard'`, async () => {
      const dateLimiteDépassée = new Date('2021-01-01')
      await GarantiesFinancières.create({
        id: new UniqueEntityID().toString(),
        projetId,
        statut: 'en attente',
        soumisesALaCandidature: false,
        dateLimiteEnvoi: dateLimiteDépassée,
      })

      const résultat = await getGarantiesFinancièresDTO({ projetId, user: utilisateurAutorisé })

      expect(résultat).toEqual({
        type: 'garanties-financières',
        statut: 'en retard',
        date: dateLimiteDépassée.getTime(),
        variant: 'admin',
      })
    })
  })

  describe(`Retourner les données de GF en attente`, () => {
    it(`Etant donné un projet soumis à garanties financières,
  et dont les GF sont en attente,
  alors la requête getGFItemProps devrait retourner un GarantiesFinancièresDTO 
  avec un statut 'en attente'`, async () => {
      await GarantiesFinancières.create({
        id: new UniqueEntityID().toString(),
        projetId,
        statut: 'en attente',
        soumisesALaCandidature: false,
        dateLimiteEnvoi,
      })

      const résultat = await getGarantiesFinancièresDTO({ projetId, user: utilisateurAutorisé })

      expect(résultat).toEqual({
        type: 'garanties-financières',
        statut: 'en attente',
        date: dateLimiteEnvoi.getTime(),
        variant: 'admin',
      })
    })
  })

  describe(`Retourner les données de GF à traiter`, () => {
    it(`Etant donné un projet soumis à garanties financières,
  et dont les GF ne sont 'à traiter',
  alors la requête getGFItemProps devrait retourner un GarantiesFinancièresDTO 
  avec un statut 'à traiter' et les données des GF soumises`, async () => {
      await File.create({ id: fichierId, filename: 'nom-fichier', designation: 'GF' })
      await User.create({
        id: envoyéesPar,
        role: 'admin',
        email: 'email@test.test',
        fullName: 'user name',
      })
      await GarantiesFinancières.create({
        id: new UniqueEntityID().toString(),
        projetId,
        statut: 'à traiter',
        soumisesALaCandidature: false,
        dateLimiteEnvoi,
        envoyéesPar,
        dateConstitution,
        fichierId,
        dateEchéance,
      })

      const résultat = await getGarantiesFinancièresDTO({ projetId, user: utilisateurAutorisé })

      expect(résultat).toEqual({
        type: 'garanties-financières',
        statut: 'à traiter',
        date: dateConstitution.getTime(),
        variant: 'admin',
        url: expect.anything(),
        envoyéesPar: 'admin',
        dateEchéance: dateEchéance.getTime(),
      })
    })
  })

  describe(`Retourner les données de GF validées`, () => {
    it(`Etant donné un projet soumis à garanties financières,
  et dont les GF sont validées par un utilisateur dans Potentiel,
  alors la requête getGFItemProps devrait retourner les données des GF 
  sous forme d'un GarantiesFinancièresDTO avec un statut 'validé'`, async () => {
      await File.create({ id: fichierId, filename: 'nom-fichier', designation: 'GF' })
      await User.create({
        id: envoyéesPar,
        role: 'admin',
        email: 'email@test.test',
        fullName: 'user name',
      })
      await GarantiesFinancières.create({
        id: new UniqueEntityID().toString(),
        projetId,
        statut: 'validé',
        soumisesALaCandidature: false,
        dateLimiteEnvoi,
        envoyéesPar,
        dateConstitution,
        fichierId,
        dateEchéance,
        validéesLe: new Date(),
        validéesPar: new UniqueEntityID().toString(),
      })

      const résultat = await getGarantiesFinancièresDTO({ projetId, user: utilisateurAutorisé })

      expect(résultat).toEqual({
        type: 'garanties-financières',
        statut: 'validé',
        date: dateConstitution.getTime(),
        variant: 'admin',
        url: expect.anything(),
        envoyéesPar: 'admin',
        dateEchéance: dateEchéance.getTime(),
      })
    })
  })

  describe(`Retourner les données de GF validées et supprimables`, () => {
    it(`Etant donné un projet soumis à garanties financières,
  et dont les GF sont validées à la candidature et non dans Potentiel,
  alors la requête getGFItemProps devrait retourner un GarantiesFinancièresDTO 
  avec un statut 'validé'et retraitDépôtPossible à "true"`, async () => {
      await File.create({ id: fichierId, filename: 'nom-fichier', designation: 'GF' })
      await User.create({
        id: envoyéesPar,
        role: 'admin',
        email: 'email@test.test',
        fullName: 'user name',
      })
      await GarantiesFinancières.create({
        id: new UniqueEntityID().toString(),
        projetId,
        statut: 'validé',
        soumisesALaCandidature: true,
        dateLimiteEnvoi,
        envoyéesPar,
        dateConstitution,
        fichierId,
        dateEchéance,
        // pas de validéPar ou validéLe ici car validation à la candidature
      })

      const résultat = await getGarantiesFinancièresDTO({ projetId, user: utilisateurAutorisé })

      expect(résultat).toEqual({
        type: 'garanties-financières',
        statut: 'validé',
        date: dateConstitution.getTime(),
        variant: 'admin',
        url: expect.anything(),
        envoyéesPar: 'admin',
        dateEchéance: dateEchéance.getTime(),
        retraitDépôtPossible: true,
      })
    })
  })
})
