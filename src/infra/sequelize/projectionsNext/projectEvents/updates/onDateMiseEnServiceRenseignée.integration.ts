import { UniqueEntityID } from '@core/domain'
import { resetDatabase } from '@infra/sequelize/helpers'
import { DateMiseEnServiceRenseignée, DateMiseEnServiceRenseignéedPayload } from '@modules/project'
import { ProjectEvent } from '../projectEvent.model'
import onDateMiseEnServiceRenseignée from './onDateMiseEnServiceRenseignée'

describe(`Handler onDateMiseEnServiceRenseignée`, () => {
  const projectId = new UniqueEntityID().toString()
  const nouvelleDateMiseEnService = '01/01/2021'
  beforeEach(async () => {
    await resetDatabase()
  })
  describe(`Project event de type 'DateMiseEnService' sans date de mise en service`, () => {
    it(`Etant donné un project event de type 'DateMiseEnService sans date de mise en service,
    alors il devrait être mis à jour avec la date de mise en service`, async () => {
      await ProjectEvent.create({
        type: 'DateMiseEnService',
        projectId,
        eventPublishedAt: new Date().getTime(),
        valueDate: new Date().getTime(),
        payload: {},
        id: new UniqueEntityID().toString(),
      })

      await onDateMiseEnServiceRenseignée(
        new DateMiseEnServiceRenseignée({
          payload: {
            projetId: projectId,
            dateMiseEnService: nouvelleDateMiseEnService,
          } as DateMiseEnServiceRenseignéedPayload,
          original: { version: 1, occurredAt: new Date() },
        })
      )

      const projectEvent = await ProjectEvent.findOne({
        where: { projectId, type: 'DateMiseEnService' },
      })

      expect(projectEvent).toMatchObject({
        type: 'DateMiseEnService',
        payload: { dateMiseEnService: nouvelleDateMiseEnService },
      })
    })
  })

  describe(`Project event de type 'DateMiseEnService' avec date de mise en service`, () => {
    it(`Etant donné un project event de type 'DateMiseEnService avec une date de mise en service,
    alors il devrait être mis à jour avec la nouvelle date de mise en service`, async () => {
      await ProjectEvent.create({
        type: 'DateMiseEnService',
        projectId,
        eventPublishedAt: new Date().getTime(),
        valueDate: new Date().getTime(),
        payload: { dateMiseEnService: 'ancienne date' },
        id: new UniqueEntityID().toString(),
      })

      await onDateMiseEnServiceRenseignée(
        new DateMiseEnServiceRenseignée({
          payload: {
            projetId: projectId,
            dateMiseEnService: nouvelleDateMiseEnService,
          } as DateMiseEnServiceRenseignéedPayload,
          original: { version: 1, occurredAt: new Date() },
        })
      )

      const projectEvent = await ProjectEvent.findOne({
        where: { projectId, type: 'DateMiseEnService' },
      })

      expect(projectEvent).toMatchObject({
        type: 'DateMiseEnService',
        payload: { dateMiseEnService: nouvelleDateMiseEnService },
      })
    })
  })

  describe(`Pas de project event de type 'DateMiseEnService'`, () => {
    it(`Etant donné un project qui n'a pas de project event de type 'DateMiseEnService',
    alors un projcet event de type 'DateMiseEnService' devrait être ajouté`, async () => {
      await onDateMiseEnServiceRenseignée(
        new DateMiseEnServiceRenseignée({
          payload: {
            projetId: projectId,
            dateMiseEnService: nouvelleDateMiseEnService,
          } as DateMiseEnServiceRenseignéedPayload,
          original: { version: 1, occurredAt: new Date() },
        })
      )

      const projectEvent = await ProjectEvent.findOne({
        where: { projectId, type: 'DateMiseEnService' },
      })

      expect(projectEvent).toMatchObject({
        type: 'DateMiseEnService',
        payload: { dateMiseEnService: nouvelleDateMiseEnService },
      })
    })
  })
})
