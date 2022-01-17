import { UniqueEntityID } from '@core/domain'
import { resetDatabase } from '../../helpers'
import models from '../../models'
import { getModificationRequestRecipient } from './getModificationRequestRecipient'

describe('Sequelize getModificationRequestRecipient', () => {
  const projectId = new UniqueEntityID().toString()
  const fileId = new UniqueEntityID().toString()
  const modificationRequestId = new UniqueEntityID().toString()
  const userId = new UniqueEntityID().toString()
  const userId2 = new UniqueEntityID().toString()

  const versionDate = new Date(456)

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()

    const ModificationRequestModel = models.ModificationRequest
    await ModificationRequestModel.create({
      id: modificationRequestId,
      projectId,
      userId,
      fileId,
      type: 'recours',
      requestedOn: 123,
      respondedOn: 321,
      respondedBy: userId2,
      status: 'envoyée',
      justification: 'justification',
      versionDate,
    })
  })

  // This is destined to have a complete implementation later (ie. include cases where DREAL is in charge, based on the rules)
  it('should return dgec', async () => {
    const statusResult = await getModificationRequestRecipient(modificationRequestId)

    expect(statusResult._unsafeUnwrap()).toEqual('dgec')
  })
})
