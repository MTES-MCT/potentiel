import models from '../../models'
import { resetDatabase } from '../../helpers'
import makeFakeProject from '../../../../__tests__/fixtures/project'

import { getProjectIdsForPeriode } from './getProjectIdsForPeriode'
import { UniqueEntityID } from '../../../../core/domain'

describe('Sequelize getProjectIdsForPeriode', () => {
  const projectId = new UniqueEntityID().toString()
  const appelOffreId = 'appelOffreId'
  const periodeId = 'periodeId'
  const familleId = 'familleId'

  const { Project } = models

  describe('given an appelOffreId, periodeId and familleId', () => {
    beforeAll(async () => {
      await resetDatabase()
      await Project.bulkCreate([
        makeFakeProject({
          id: projectId,
          appelOffreId,
          periodeId,
          familleId,
          notifiedOn: 1,
        }),
        makeFakeProject({
          appelOffreId,
          periodeId,
          familleId: 'otherFamilleId',
          notifiedOn: 1,
        }),
        makeFakeProject({
          appelOffreId,
          periodeId,
          notifiedOn: 0,
        }),
        makeFakeProject({
          appelOffreId,
          periodeId: 'otherPeriodeId',
          notifiedOn: 1,
        }),
        makeFakeProject({
          appelOffreId: 'otherAppelOffreId',
          periodeId,
          notifiedOn: 1,
        }),
      ])
    })

    it('should return a list of ids for notified projects for this appeloffre, periode and famille', async () => {
      const res = await getProjectIdsForPeriode({ appelOffreId, periodeId, familleId })

      expect(res._unsafeUnwrap()).toEqual([projectId])
    })
  })

  describe('given only an appelOffreId and periodeId', () => {
    beforeAll(async () => {
      await resetDatabase()
      await Project.bulkCreate([
        makeFakeProject({
          id: projectId,
          appelOffreId,
          periodeId,
          notifiedOn: 1,
        }),
        makeFakeProject({
          appelOffreId,
          periodeId,
          notifiedOn: 0,
        }),
        makeFakeProject({
          appelOffreId,
          periodeId: 'otherPeriodeId',
          notifiedOn: 1,
        }),
        makeFakeProject({
          appelOffreId: 'otherAppelOffreId',
          periodeId,
          notifiedOn: 1,
        }),
      ])
    })

    it('should return a list of ids for notified projects for this appeloffre and periode', async () => {
      const res = await getProjectIdsForPeriode({ appelOffreId, periodeId })

      expect(res._unsafeUnwrap()).toEqual([projectId])
    })
  })
})
