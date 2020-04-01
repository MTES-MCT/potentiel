import makeRequestModification from './requestModification'

import { modificationRequestRepo } from '../dataAccess/inMemory'

const requestModification = makeRequestModification({ modificationRequestRepo })

describe('requestModification use-case', () => {
  // beforeAll(async () => {

  // })

  it('should create a new modification request', async () => {
    const requestData = {
      type: 'actionnaire' as 'actionnaire',
      actionnaire: 'nouvel actionnaire',
      filePath: 'fichier',
      userId: '1',
      projectId: '1'
    }
    const requestResult = await requestModification(requestData)

    expect(requestResult.is_ok()).toBeTruthy()
    if (requestResult.is_err()) return

    const allRequests = await modificationRequestRepo.findAll()

    expect(allRequests).toHaveLength(1)

    const newRequest = allRequests[0]
    expect(newRequest).toEqual(expect.objectContaining(requestData))
  })

  // TODO
  it.todo(
    'should return an error when type is delai and delayedServiceDate is before the theoretic date'
  )

  it.todo(
    "should return an error if this user doesn't have rights on this project"
  )
})
