import makeShowNotification from './showNotification'

import makeFakeCandidateNotification from '../__tests__/fixtures/candidateNotification'

import { candidateNotificationRepo } from '../dataAccess/inMemory'
import { makeCandidateNotification } from '../entities'

const showNotification = makeShowNotification({ candidateNotificationRepo })

describe('showNotification use-case', () => {
  let candidateNotification

  beforeAll(async () => {
    const candidateNotificationResult = makeCandidateNotification(
      makeFakeCandidateNotification()
    )

    expect(candidateNotificationResult.is_ok()).toBeTruthy()
    if (!candidateNotificationResult.is_ok()) return

    const candidationNotificationInstance = candidateNotificationResult.unwrap()

    await candidateNotificationRepo.insert(candidationNotificationInstance)
    const foundNotifications = await candidateNotificationRepo.findAll()
    expect(foundNotifications).toHaveLength(1)
    candidateNotification = foundNotifications[0]
  })

  it('should return a specific notification by id', async () => {
    const foundNotificationResult = await showNotification({
      id: candidateNotification.id
    })

    expect(foundNotificationResult.is_some())
    expect(foundNotificationResult.unwrap()).toEqual(candidateNotification)
  })
})
