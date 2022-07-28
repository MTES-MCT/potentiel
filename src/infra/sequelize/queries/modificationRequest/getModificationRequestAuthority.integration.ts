import { UniqueEntityID } from '@core/domain'
import { resetDatabase } from '../../helpers'
import models from '../../models'
import { getModificationRequestAuthority } from './getModificationRequestAuthority'

describe('Sequelize getModificationRequestAuthority', () => {
  const projectId = new UniqueEntityID().toString()
  const modificationRequestId = new UniqueEntityID().toString()
  const versionDate = new Date(456)

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()

    const ModificationRequestModel = models.ModificationRequest
    await ModificationRequestModel.create({
      id: modificationRequestId,
      projectId,
      type: 'abandon',
      requestedOn: 123,
      status: 'envoyée',
      versionDate,
      authority: 'dreal',
    })
  })

  it('should return authority', async () => {
    const authority = await getModificationRequestAuthority(modificationRequestId)
    expect(authority).toEqual('dreal')
  })
})
