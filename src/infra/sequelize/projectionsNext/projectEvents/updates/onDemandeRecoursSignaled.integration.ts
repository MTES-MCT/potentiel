import { UniqueEntityID } from '@core/domain'
import { DemandeRecoursSignaled } from '@modules/project'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onDemandeRecoursSignaled from './onDemandeRecoursSignaled'

describe('onDemandeRecoursSignaled', () => {
  const projectId = new UniqueEntityID().toString()

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should create a new project event of type DemandeRecoursSignaled', async () => {
    const occurredAt = new Date('2022-01-04')
    const decidedOn = new Date('2022-04-12').getTime()

    await onDemandeRecoursSignaled(
      new DemandeRecoursSignaled({
        payload: {
          projectId,
          decidedOn,
          status: 'acceptée',
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
      type: 'DemandeRecoursSignaled',
      valueDate: decidedOn,
      eventPublishedAt: occurredAt.getTime(),
      payload: {
        signaledBy: 'fakeUser',
        status: 'acceptée',
        notes: 'notes',
        attachment: { id: 'file-id', name: 'file-name' },
      },
    })
  })
})
