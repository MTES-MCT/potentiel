import { ProjectEvent } from '..'
import { UniqueEntityID } from '../../../../../core/domain'
import {
  ProjectNotificationDateSet,
  ProjectNotificationDateSetPayload,
} from '../../../../../modules/project'
import { resetDatabase } from '../../../helpers'
import onProjectNotificationDateSet from './onProjectNotificationDateSet'

describe('onProjectNotificationDateSet', () => {
  beforeAll(async () => {
    await resetDatabase()
  })
  it('should add ProjectNotificationDateSet events in ProjectEvent table', async () => {
    const projectId = new UniqueEntityID().toString()
    const notifiedOn = new Date('2022-01-19').getTime()
    const occurredAt = new Date('2022-01-20')

    await onProjectNotificationDateSet(
      new ProjectNotificationDateSet({
        payload: { projectId, notifiedOn, setBy: 'user-id' } as ProjectNotificationDateSetPayload,
        original: { version: 1, occurredAt },
      })
    )

    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

    expect(projectEvent).not.toBeNull()
    expect(projectEvent).toMatchObject({
      type: 'ProjectNotificationDateSet',
      valueDate: notifiedOn,
      eventPublishedAt: occurredAt.getTime(),
      projectId,
    })
  })
})
