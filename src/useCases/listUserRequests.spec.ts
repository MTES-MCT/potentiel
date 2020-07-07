import { modificationRequestRepo } from '../dataAccess/inMemory'
import makeFakeRequest from '../__tests__/fixtures/modificationRequest'
import makeListUserRequests from './listUserRequests'

const listUserRequests = makeListUserRequests({ modificationRequestRepo })

describe('listUserRequests use-case', () => {
  const userId = '1234'
  const projectId = 'projectId'
  let foundUserRequests
  let userRequest
  beforeAll(async () => {
    // Add a modification request through the requestModification use-case
    userRequest = {
      type: 'actionnaire',
      actionnaire: 'nouvel actionnaire',
      filename: 'fichier',
      userId,
      projectId,
    }

    await modificationRequestRepo.insert(userRequest)

    // Add another modification request for a phony user
    await modificationRequestRepo.insert(makeFakeRequest({ userId: 'other' }))

    const allModificationRequests = await modificationRequestRepo.findAll()
    expect(allModificationRequests).toHaveLength(2)

    foundUserRequests = await listUserRequests({ userId })
  })

  it('should return the requests made by the user', async () => {
    expect(foundUserRequests).toHaveLength(1)
    expect(foundUserRequests[0]).toEqual(expect.objectContaining(userRequest))
  })
})
