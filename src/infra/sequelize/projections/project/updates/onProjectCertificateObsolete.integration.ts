import { resetDatabase } from '../../../helpers'
import {
  ProjectCertificateGenerated,
  ProjectCertificateObsolete,
  ProjectCertificateRegenerated,
  ProjectCertificateUpdated,
} from '@modules/project'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import models from '../../../models'
import { onProjectCertificateObsolete } from './onProjectCertificateObsolete'
import { v4 as uuid } from 'uuid'

describe('project.onProjectCertificateObsolete', () => {
  const projectId = uuid()
  const fakeProjectId = uuid()

  const certificateFileId = uuid()

  const fakeProjects = [
    {
      id: projectId,
      certificateFileId,
    },
  ].map(makeFakeProject)

  const { Project } = models

  beforeEach(async () => {
    await resetDatabase()

    await Project.bulkCreate(fakeProjects)
  })

  it('should remove project.certificateFileId', async () => {
    await onProjectCertificateObsolete(models)(
      new ProjectCertificateObsolete({
        payload: {
          projectId,
        },
      })
    )

    const updatedProject = await Project.findByPk(projectId)
    expect(updatedProject.certificateFileId).toBeNull()
  })
})
