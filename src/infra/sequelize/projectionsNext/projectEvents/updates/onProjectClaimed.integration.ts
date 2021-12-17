import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectClaimed } from '../../../../../modules/projectClaim'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onProjectClaimed from './onProjectClaimed'

describe('onProjectClaimed', () => {
  const projectId = new UniqueEntityID().toString()
  const claimedBy = new UniqueEntityID().toString()
  const attestationDesignationFileId = new UniqueEntityID().toString()

  beforeAll(async () => {
    await resetDatabase()

    await onProjectClaimed(
      new ProjectClaimed({
        payload: {
          projectId,
          claimedBy,
          attestationDesignationFileId,
          claimerEmail: '',
        },
        original: {
          version: 1,
          occurredAt: new Date(1234),
        },
      })
    )
  })

  it('should create a new project event of type ProjectClaimed', async () => {
    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

    expect(projectEvent).not.toBeNull()

    expect(projectEvent).toMatchObject({
      type: 'ProjectClaimed',
      valueDate: 1234,
      payload: { claimedBy, attestationDesignationFileId },
    })
  })
})
