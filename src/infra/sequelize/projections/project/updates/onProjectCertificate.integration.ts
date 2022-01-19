import { resetDatabase } from '../../../helpers'
import {
  ProjectCertificateGenerated,
  ProjectCertificateRegenerated,
  ProjectCertificateUpdated,
} from '@modules/project'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import models from '../../../models'
import { onProjectCertificate } from './onProjectCertificate'
import { v4 as uuid } from 'uuid'

describe('project.onProjectCertificate', () => {
  const projectId = uuid()
  const fakeProjectId = uuid()

  const certificateFile1 = uuid()
  const certificateFile2 = uuid()

  const fakeProjects = [
    {
      id: projectId,
      certificateFileId: null,
    },
    {
      id: fakeProjectId,
      certificateFileId: null,
    },
  ].map(makeFakeProject)

  const ProjectModel = models.Project
  const FileModel = models.File

  beforeEach(async () => {
    await resetDatabase()

    await ProjectModel.bulkCreate(fakeProjects)
    await FileModel.create({
      id: certificateFile1,
      filename: '',
      designation: '',
    })
  })

  it('should update project.certificateFileId on ProjectCertificateGenerated', async () => {
    await onProjectCertificate(models)(
      new ProjectCertificateGenerated({
        payload: {
          certificateFileId: certificateFile2,
          projectId: projectId,
          projectVersionDate: new Date(0),
          candidateEmail: '',
          periodeId: '',
          appelOffreId: '',
        },
      })
    )

    const updatedProject = await ProjectModel.findByPk(projectId)
    expect(updatedProject.certificateFileId).toEqual(certificateFile2)

    const nonUpdatedProject = await ProjectModel.findByPk(fakeProjectId)
    expect(nonUpdatedProject).toBeDefined()
    if (nonUpdatedProject) return

    expect(nonUpdatedProject.certificateFileId).toEqual(null)
  })

  it('should update project.certificateFileId on ProjectCertificateRegenerated', async () => {
    await onProjectCertificate(models)(
      new ProjectCertificateRegenerated({
        payload: {
          certificateFileId: certificateFile1,
          projectId: projectId,
          projectVersionDate: new Date(0),
        },
      })
    )

    const updatedProject = await ProjectModel.findByPk(projectId)
    expect(updatedProject.certificateFileId).toEqual(certificateFile1)

    const nonUpdatedProject = await ProjectModel.findByPk(fakeProjectId)
    expect(nonUpdatedProject).toBeDefined()
    if (nonUpdatedProject) return

    expect(nonUpdatedProject.certificateFileId).toEqual(null)
  })

  it('should update project.certificateFileId on ProjectCertificateUpdated', async () => {
    await onProjectCertificate(models)(
      new ProjectCertificateUpdated({
        payload: {
          certificateFileId: certificateFile1,
          projectId: projectId,
          uploadedBy: 'user1',
        },
      })
    )

    const updatedProject = await ProjectModel.findByPk(projectId)
    expect(updatedProject.certificateFileId).toEqual(certificateFile1)

    const nonUpdatedProject = await ProjectModel.findByPk(fakeProjectId)
    expect(nonUpdatedProject).toBeDefined()
    if (nonUpdatedProject) return

    expect(nonUpdatedProject.certificateFileId).toEqual(null)
  })
})
