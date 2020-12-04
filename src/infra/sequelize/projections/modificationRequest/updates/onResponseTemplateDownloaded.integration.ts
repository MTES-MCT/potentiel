import models from '../../../models'
import { sequelize } from '../../../../../sequelize.config'
import { onResponseTemplateDownloaded } from './onResponseTemplateDownloaded'
import { ResponseTemplateDownloaded } from '../../../../../modules/modificationRequest/events'
import { UniqueEntityID } from '../../../../../core/domain'

describe('modificationRequest.onResponseTemplateDownloaded', () => {
  const ModificationRequestModel = models.ModificationRequest

  const modificationRequestId = new UniqueEntityID().toString()
  const projectId = new UniqueEntityID().toString()
  const userId = new UniqueEntityID().toString()

  describe('when status is envoyée', () => {
    beforeAll(async () => {
      // Create the tables and remove all data
      await sequelize.sync({ force: true })

      await ModificationRequestModel.create({
        id: modificationRequestId,
        projectId,
        userId,
        type: 'recours',
        status: 'envoyée',
        requestedOn: 1,
        requestedBy: userId,
      })
    })

    it('should update status to en instruction', async () => {
      await onResponseTemplateDownloaded(models)(
        new ResponseTemplateDownloaded({
          payload: {
            modificationRequestId,
            downloadedBy: userId,
          },
        })
      )

      const updatedModificationRequest = await ModificationRequestModel.findByPk(
        modificationRequestId
      )
      expect(updatedModificationRequest.status).toEqual('en instruction')
    })
  })

  describe('when status is some other', () => {
    beforeAll(async () => {
      // Create the tables and remove all data
      await sequelize.sync({ force: true })

      await ModificationRequestModel.create({
        id: modificationRequestId,
        projectId,
        userId,
        type: 'recours',
        status: 'other',
        requestedOn: 1,
        requestedBy: userId,
      })
    })

    it('should not update status', async () => {
      await onResponseTemplateDownloaded(models)(
        new ResponseTemplateDownloaded({
          payload: {
            modificationRequestId,
            downloadedBy: userId,
          },
        })
      )

      const updatedModificationRequest = await ModificationRequestModel.findByPk(
        modificationRequestId
      )
      expect(updatedModificationRequest.status).toEqual('other')
    })
  })
})
