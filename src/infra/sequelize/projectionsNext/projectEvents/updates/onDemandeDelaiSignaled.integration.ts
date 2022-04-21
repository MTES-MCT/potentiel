import { UniqueEntityID } from '@core/domain'
import { DemandeDelaiSignaled } from '@modules/project'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onDemandeDelaiSignaled from './onDemandeDelaiSignaled'

describe('onDemandeDelaiSignaled', () => {
  const projectId = new UniqueEntityID().toString()

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should create a new project event of type DemandeDelaiSignaled', async () => {
    const occurredAt = new Date('2022-01-04')
    const decidedOn = new Date('2022-04-12').getTime()

    await onDemandeDelaiSignaled(
      new DemandeDelaiSignaled({
        payload: {
          projectId,
          decidedOn,
          newCompletionDueOn: new Date('2028-04-12').getTime(),
          status: 'acceptée',
          isNewDateApplicable: true,
          notes: 'notes',
          attachments: [{ id: 'file-id', name: 'file-name' }],
          signaledBy: 'fakeUser',
        },
        original: {
          version: 1,
          occurredAt,
        },
      })
    )

    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

    expect(projectEvent).not.toBeNull()

    expect(projectEvent).toMatchObject({
      type: 'DemandeDelaiSignaled',
      valueDate: decidedOn,
      eventPublishedAt: occurredAt.getTime(),
      payload: {
        signaledBy: 'fakeUser',
        newCompletionDueOn: new Date('2028-04-12').getTime(),
        status: 'acceptée',
        isNewDateApplicable: true,
        notes: 'notes',
        attachment: { id: 'file-id', name: 'file-name' },
      },
    })
  })
})
