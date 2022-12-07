import { UniqueEntityID } from '@core/domain'
import { resetDatabase } from '@infra/sequelize/helpers'
import { DonnéesDeRaccordementRenseignées } from '@modules/project'
import { ProjectEvent } from '../projectEvent.model'
import onDonnéesDeRaccordementRenseignées from './onDonnéesDeRaccordementRenseignées'

describe(`Handler onDonnéesDeRaccordementRenseignées`, () => {
  const projectId = new UniqueEntityID().toString()

  beforeEach(async () => {
    await resetDatabase()
  })

  describe(`Date de mise en service`, () => {
    const nouvelleDateMiseEnService = new Date('01/01/2021')

    describe(`Project event de type 'DateMiseEnService' sans date de mise en service`, () => {
      it(`Etant donné un project event de type 'DateMiseEnService sans date de mise en service,
        Alors il devrait être mis à jour avec la date de mise en service`, async () => {
        await ProjectEvent.create({
          type: 'DateMiseEnService',
          projectId,
          eventPublishedAt: new Date().getTime(),
          valueDate: new Date().getTime(),
          payload: {},
          id: new UniqueEntityID().toString(),
        })

        await onDonnéesDeRaccordementRenseignées(
          new DonnéesDeRaccordementRenseignées({
            payload: {
              projetId: projectId,
              dateMiseEnService: nouvelleDateMiseEnService,
            },
            original: { version: 1, occurredAt: new Date() },
          })
        )

        const projectEvent = await ProjectEvent.findOne({
          where: { projectId, type: 'DateMiseEnService' },
        })

        expect(projectEvent).toMatchObject({
          type: 'DateMiseEnService',
          payload: { dateMiseEnService: nouvelleDateMiseEnService.toISOString() },
        })
      })
    })

    describe(`Project event de type 'DateMiseEnService' avec date de mise en service`, () => {
      it(`Etant donné un project event de type 'DateMiseEnService avec une date de mise en service,
        Alors il devrait être mis à jour avec la nouvelle date de mise en service`, async () => {
        await ProjectEvent.create({
          type: 'DateMiseEnService',
          projectId,
          eventPublishedAt: new Date().getTime(),
          valueDate: new Date().getTime(),
          payload: { dateMiseEnService: 'ancienne date' },
          id: new UniqueEntityID().toString(),
        })

        await onDonnéesDeRaccordementRenseignées(
          new DonnéesDeRaccordementRenseignées({
            payload: {
              projetId: projectId,
              dateMiseEnService: nouvelleDateMiseEnService,
            },
            original: { version: 1, occurredAt: new Date() },
          })
        )

        const projectEvent = await ProjectEvent.findOne({
          where: { projectId, type: 'DateMiseEnService' },
        })

        expect(projectEvent).toMatchObject({
          type: 'DateMiseEnService',
          payload: { dateMiseEnService: nouvelleDateMiseEnService.toISOString() },
        })
      })
    })

    describe(`Pas de project event de type 'DateMiseEnService'`, () => {
      it(`Etant donné un project qui n'a pas de project event de type 'DateMiseEnService',
    alors un project event de type 'DateMiseEnService' devrait être ajouté`, async () => {
        await onDonnéesDeRaccordementRenseignées(
          new DonnéesDeRaccordementRenseignées({
            payload: {
              projetId: projectId,
              dateMiseEnService: nouvelleDateMiseEnService,
            },
            original: { version: 1, occurredAt: new Date() },
          })
        )

        const projectEvent = await ProjectEvent.findOne({
          where: { projectId, type: 'DateMiseEnService' },
        })

        expect(projectEvent).toMatchObject({
          type: 'DateMiseEnService',
          payload: { dateMiseEnService: nouvelleDateMiseEnService.toISOString() },
        })
      })
    })
  })

  describe(`Date en file d'attente`, () => {
    const nouvelleDateFileAttente = new Date('01/01/2022')

    describe(`Project event de type 'DateFileAttente' sans date en file d'attente`, () => {
      it(`Etant donné un project event de type 'DateFileAttente sans date en file d'attente,
        Alors il devrait être mis à jour avec la date en file d'attente`, async () => {
        await ProjectEvent.create({
          type: 'DateFileAttente',
          projectId,
          eventPublishedAt: new Date().getTime(),
          valueDate: new Date().getTime(),
          payload: {},
          id: new UniqueEntityID().toString(),
        })

        await onDonnéesDeRaccordementRenseignées(
          new DonnéesDeRaccordementRenseignées({
            payload: {
              projetId: projectId,
              dateMiseEnService: new Date('2022-01-01'),
              dateFileAttente: nouvelleDateFileAttente,
            },
            original: { version: 1, occurredAt: new Date() },
          })
        )

        const projectEvent = await ProjectEvent.findOne({
          where: { projectId, type: 'DateFileAttente' },
        })

        expect(projectEvent).toMatchObject({
          type: 'DateFileAttente',
          payload: { dateFileAttente: nouvelleDateFileAttente.toISOString() },
        })
      })
    })

    describe(`Project event de type 'DateFileAttente' avec date en file d'attente`, () => {
      it(`Etant donné un project event de type 'DateFileAttente avec une date en file d'attente,
        Alors il devrait être mis à jour avec la nouvelle date en file d'attente`, async () => {
        await ProjectEvent.create({
          type: 'DateFileAttente',
          projectId,
          eventPublishedAt: new Date().getTime(),
          valueDate: new Date().getTime(),
          payload: { dateFileAttente: 'ancienne date' },
          id: new UniqueEntityID().toString(),
        })

        await onDonnéesDeRaccordementRenseignées(
          new DonnéesDeRaccordementRenseignées({
            payload: {
              projetId: projectId,
              dateMiseEnService: new Date('2022-01-01'),
              dateFileAttente: nouvelleDateFileAttente,
            },
            original: { version: 1, occurredAt: new Date() },
          })
        )

        const projectEvent = await ProjectEvent.findOne({
          where: { projectId, type: 'DateFileAttente' },
        })

        expect(projectEvent).toMatchObject({
          type: 'DateFileAttente',
          payload: { dateFileAttente: nouvelleDateFileAttente.toISOString() },
        })
      })
    })

    describe(`Pas de project event de type 'DateFileAttente'`, () => {
      it(`Etant donné un project qui n'a pas de project event de type 'DateFileAttente',
    alors un project event de type 'DateFileAttente' devrait être ajouté`, async () => {
        await onDonnéesDeRaccordementRenseignées(
          new DonnéesDeRaccordementRenseignées({
            payload: {
              projetId: projectId,
              dateMiseEnService: new Date('2022-01-01'),
              dateFileAttente: nouvelleDateFileAttente,
            },
            original: { version: 1, occurredAt: new Date() },
          })
        )

        const projectEvent = await ProjectEvent.findOne({
          where: { projectId, type: 'DateFileAttente' },
        })

        expect(projectEvent).toMatchObject({
          type: 'DateFileAttente',
          payload: { dateFileAttente: nouvelleDateFileAttente.toISOString() },
        })
      })
    })
  })
})
