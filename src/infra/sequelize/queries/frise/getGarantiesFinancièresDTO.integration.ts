import { getGarantiesFinancièresDTO } from './getGarantiesFinancièresDTO'
import { resetDatabase } from '@infra/sequelize/helpers'
import { UniqueEntityID } from '@core/domain'
import { User } from '@entities'
import { GarantiesFinancièresStatut } from '@infra/sequelize/projectionsNext/garantiesFinancières'

describe(`Requête getGarantiesFinancièresDTO`, () => {
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
      const garantiesFinancières = {
        statut: 'en attente' as GarantiesFinancièresStatut,
        soumisesALaCandidature: false,
        dateLimiteEnvoi: dateLimiteDépassée,
        envoyéesPar: new UniqueEntityID().toString(),
        dateConstitution: null,
        dateEchéance: null,
        validéesPar: null,
      }

      const résultat = await getGarantiesFinancièresDTO({
        garantiesFinancières,
        user: utilisateurAutorisé,
      })

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
      const garantiesFinancières = {
        statut: 'en attente' as GarantiesFinancièresStatut,
        soumisesALaCandidature: false,
        dateLimiteEnvoi,
        envoyéesPar: new UniqueEntityID().toString(),
        dateConstitution: null,
        dateEchéance: null,
        validéesPar: null,
      }

      const résultat = await getGarantiesFinancièresDTO({
        garantiesFinancières,
        user: utilisateurAutorisé,
      })

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
      const garantiesFinancières = {
        statut: 'à traiter' as GarantiesFinancièresStatut,
        soumisesALaCandidature: false,
        dateLimiteEnvoi,
        envoyéesPar,
        dateConstitution,
        dateEchéance,
        validéesPar: null,
        fichier: { id: fichierId, filename: 'nom-fichier' },
        envoyéesParRef: { role: 'porteur-projet' as 'porteur-projet' },
      }

      const résultat = await getGarantiesFinancièresDTO({
        garantiesFinancières,
        user: utilisateurAutorisé,
      })

      expect(résultat).toEqual({
        type: 'garanties-financières',
        statut: 'à traiter',
        date: dateConstitution.getTime(),
        variant: 'admin',
        url: expect.anything(),
        envoyéesPar: 'porteur-projet',
        dateEchéance: dateEchéance.getTime(),
      })
    })
  })

  describe(`Retourner les données de GF validées`, () => {
    it(`Etant donné un projet soumis à garanties financières,
  et dont les GF sont validées par un utilisateur dans Potentiel,
  alors la requête getGFItemProps devrait retourner les données des GF 
  sous forme d'un GarantiesFinancièresDTO avec un statut 'validé'`, async () => {
      const garantiesFinancières = {
        statut: 'validé' as GarantiesFinancièresStatut,
        soumisesALaCandidature: false,
        dateLimiteEnvoi,
        envoyéesPar,
        dateConstitution,
        dateEchéance,
        validéesPar: new UniqueEntityID().toString(),
        fichier: { id: fichierId, filename: 'nom-fichier' },
        envoyéesParRef: { role: 'admin' as 'admin' },
      }

      const résultat = await getGarantiesFinancièresDTO({
        garantiesFinancières,
        user: utilisateurAutorisé,
      })

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
      const garantiesFinancières = {
        statut: 'validé' as GarantiesFinancièresStatut,
        soumisesALaCandidature: false,
        dateLimiteEnvoi,
        envoyéesPar,
        dateConstitution,
        dateEchéance,
        validéesPar: null,
        fichier: { id: fichierId, filename: 'nom-fichier' },
        envoyéesParRef: { role: 'admin' as 'admin' },
      }

      const résultat = await getGarantiesFinancièresDTO({
        garantiesFinancières,
        user: utilisateurAutorisé,
      })

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
