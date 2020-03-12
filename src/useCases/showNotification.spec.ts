import makeShowNotification from './showNotification'

import makeFakeCandidateNotification from '../__tests__/fixtures/candidateNotification'

import { candidateNotificationRepo } from '../dataAccess/inMemory'

const showNotification = makeShowNotification({ candidateNotificationRepo })

describe('showNotification use-case', () => {
  let candidateNotification

  beforeAll(async () => {
    await candidateNotificationRepo.insertMany([
      makeFakeCandidateNotification()
    ])
    const foundNotifications = await candidateNotificationRepo.findAll()
    expect(foundNotifications).toHaveLength(1)
    candidateNotification = foundNotifications[0]
  })

  it('should return a specific notification by id', async () => {
    const foundNotification = await showNotification({
      id: candidateNotification.id
    })

    expect(foundNotification).toEqual(candidateNotification)
  })
})
