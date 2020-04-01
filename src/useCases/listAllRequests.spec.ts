import { modificationRequestRepo } from '../dataAccess/inMemory'
import makeFakeRequest from '../__tests__/fixtures/modificationRequest'
import makeListAllRequests from './listAllRequests'

const listAllRequests = makeListAllRequests({ modificationRequestRepo })

describe('listAllRequests use-case', () => {
  beforeAll(async () => {
    // Add modification requests
    await Promise.all(
      [1, 2, 3]
        .map(item => makeFakeRequest({ id: item.toString() }))
        .map(modificationRequestRepo.insert)
    )

    const allModificationRequests = await modificationRequestRepo.findAll()
    expect(allModificationRequests).toHaveLength(3)
  })

  it('should return all the requests', async () => {
    const foundRequests = await listAllRequests()
    expect(foundRequests).toHaveLength(3)
  })

  it.todo(
    'should include the events that happened on each request'
    // async () => {
    //   // TODO: add events to the modificationRequest in the beforeAll statement (call the update modificationRequest use-case once it exists)
    //   expect(foundUserRequests[0].events).toBeDefined()
    // }
  )
})
