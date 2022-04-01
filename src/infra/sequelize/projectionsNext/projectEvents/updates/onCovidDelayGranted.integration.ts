import { UniqueEntityID } from '@core/domain'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import { CovidDelayGranted, CovidDelayGrantedPayload } from '@modules/project'
import onCovidDelayGranted from './onCovidDelayGranted'

describe('onCovidDelayGranted', () => {
  const projectId = new UniqueEntityID().toString()

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should create a new project event of type CovidDelayGranted', async () => {
    const eventDate = new Date('2022-01-04')
    const completionDueOn = new Date('2024-01-01').getTime()

    await onCovidDelayGranted(
      new CovidDelayGranted({
        payload: {
          projectId,
          completionDueOn,
        } as CovidDelayGrantedPayload,
        original: {
          version: 1,
          occurredAt: eventDate,
        },
      })
    )

    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

    expect(projectEvent).not.toBeNull()
    expect(projectEvent).toMatchObject({
      type: 'CovidDelayGranted',
      valueDate: eventDate.getTime(),
      eventPublishedAt: eventDate.getTime(),
      payload: {},
    })
  })
})
