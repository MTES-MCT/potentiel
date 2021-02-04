import { UniqueEntityID } from '../../../../../core/domain'
import {
  InvitationToProjectCancelled,
  UserRightsToProjectRevoked,
} from '../../../../../modules/authorization'
import { resetDatabase } from '../../../helpers'
import models from '../../../models'
import { onInvitationToProjectCancelled } from './onInvitationToProjectCancelled'

describe('projectAdmissionKey.onInvitationToProjectCancelled', () => {
  const { ProjectAdmissionKey } = models

  const projectAdmissionKeyId = new UniqueEntityID().toString()
  const otherProjectAdmissionKeyId = new UniqueEntityID().toString()
  const userId = new UniqueEntityID().toString()

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()

    const commonProps = {
      email: '',
      fullName: '',
      projectId: new UniqueEntityID().toString(),
      cancelled: false,
    }

    await ProjectAdmissionKey.bulkCreate([
      {
        ...commonProps,
        id: projectAdmissionKeyId,
      },
      {
        ...commonProps,
        id: otherProjectAdmissionKeyId,
      },
    ])
  })

  it('should set the projectAdmissionKey.cancelled to true', async () => {
    expect((await ProjectAdmissionKey.findByPk(projectAdmissionKeyId)).cancelled).toEqual(false)
    expect((await ProjectAdmissionKey.findByPk(otherProjectAdmissionKeyId)).cancelled).toEqual(
      false
    )

    const event = new InvitationToProjectCancelled({
      payload: {
        projectAdmissionKeyId,
        cancelledBy: new UniqueEntityID().toString(),
      },
    })
    await onInvitationToProjectCancelled(models)(event)

    expect((await ProjectAdmissionKey.findByPk(projectAdmissionKeyId)).cancelled).toEqual(true)
    expect((await ProjectAdmissionKey.findByPk(otherProjectAdmissionKeyId)).cancelled).toEqual(
      false
    )
  })
})
