import models from '../../../models'
import { resetDatabase } from '../../../helpers'
import { onModificationRequestInstructionStarted } from './onModificationRequestInstructionStarted'
import { ModificationRequestInstructionStarted } from '@modules/modificationRequest'
import { UniqueEntityID } from '@core/domain'

describe(`Handler de l'évènement de onModificationRequestInstructionStarted`, () => {
  const ModificationRequestModel = models.ModificationRequest
  const projectId = new UniqueEntityID().toString()
  const userId = new UniqueEntityID().toString()
  const status = 'envoyée'
  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()
  })

  describe(`Si la demande de modification est de type délai`, () => {
    it(`Alors la demande de modification ne doit pas avoir de statut modifié`, async () => {
      const modificationRequestId = new UniqueEntityID().toString()

      await ModificationRequestModel.create({
        id: modificationRequestId,
        projectId,
        userId,
        type: 'delai',
        status,
        requestedOn: 1,
        requestedBy: userId,
      })

      await onModificationRequestInstructionStarted(models)(
        new ModificationRequestInstructionStarted({
          payload: {
            modificationRequestId,
          },
        })
      )

      const updatedModificationRequest = await ModificationRequestModel.findByPk(
        modificationRequestId
      )
      expect(updatedModificationRequest.status).toEqual(status)
    })
  })

  describe(`Si la demande de modification n'est pas de type délai`, () => {
    it(`Alors la demande de modification doit avoir un statut modifié ayant comme valeur 'en instruction'`, async () => {
      const modificationRequestId = new UniqueEntityID().toString()

      await ModificationRequestModel.create({
        id: modificationRequestId,
        projectId,
        userId,
        type: 'recours',
        status: 'envoyée',
        requestedOn: 1,
        requestedBy: userId,
      })

      await onModificationRequestInstructionStarted(models)(
        new ModificationRequestInstructionStarted({
          payload: {
            modificationRequestId,
          },
        })
      )

      const updatedModificationRequest = await ModificationRequestModel.findByPk(
        modificationRequestId
      )
      expect(updatedModificationRequest.status).toEqual('en instruction')
    })
  })
})
