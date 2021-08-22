import { getProjectIdForAdmissionKey } from './getProjectIdForAdmissionKey'
import { resetDatabase } from '../../helpers'
import { UniqueEntityID } from '../../../../core/domain'
import models from '../../models'

describe('Sequelize getProjectIdForAdmissionKey', () => {
  const projectAdmissionKeyId = new UniqueEntityID().toString()
  const projectId = new UniqueEntityID().toString()

  beforeAll(async () => {
    await resetDatabase()

    const { ProjectAdmissionKey } = models
    await ProjectAdmissionKey.bulkCreate([
      {
        id: projectAdmissionKeyId,
        projectId,
        email: '',
        fullName: '',
      },
    ])
  })

  it('should return the projectId', async () => {
    expect((await getProjectIdForAdmissionKey(projectAdmissionKeyId))._unsafeUnwrap()).toEqual(
      projectId
    )
  })
})
