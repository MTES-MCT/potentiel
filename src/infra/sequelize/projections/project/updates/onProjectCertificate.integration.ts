import {
  ProjectCertificateGenerated,
  ProjectCertificateRegenerated,
  ProjectCertificateUploaded,
} from '../../../../../modules/project/events'
import { sequelize } from '../../../../../sequelize.config'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import models from '../../../models'
import { onProjectCertificate } from './onProjectCertificate'

describe('project.onProjectCertificate', () => {
  const fakeProjects = [
    {
      id: 'target',
      certificateFileId: null,
    },
    {
      id: 'nottarget',
      certificateFileId: null,
    },
  ].map(makeFakeProject)

  const ProjectModel = models.Project
  const FileModel = models.File

  beforeEach(async () => {
    // Create the tables and remove all data
    await sequelize.sync({ force: true })

    await ProjectModel.bulkCreate(fakeProjects)
    await FileModel.create({
      id: 'certificateFile1',
      filename: '',
      designation: '',
    })
  })

  it('should update project.certificateFileId on ProjectCertificateGenerated', async () => {
    await onProjectCertificate(models)(
      new ProjectCertificateGenerated({
        payload: {
          certificateFileId: 'certificateFile1',
          projectVersionDate: new Date(0),
          projectId: 'target',
          candidateEmail: '',
          periodeId: '',
          appelOffreId: '',
        },
      })
    )

    const updatedProject = await ProjectModel.findByPk('target')
    expect(updatedProject.certificateFileId).toEqual('certificateFile1')

    const nonUpdatedProject = await ProjectModel.findByPk('nottarget')
    expect(nonUpdatedProject).toBeDefined()
    if (nonUpdatedProject) return

    expect(nonUpdatedProject.certificateFileId).toEqual(null)
  })

  it('should update project.certificateFileId on ProjectCertificateRegenerated', async () => {
    await onProjectCertificate(models)(
      new ProjectCertificateRegenerated({
        payload: {
          certificateFileId: 'certificateFile1',
          projectVersionDate: new Date(0),
          projectId: 'target',
        },
      })
    )

    const updatedProject = await ProjectModel.findByPk('target')
    expect(updatedProject.certificateFileId).toEqual('certificateFile1')

    const nonUpdatedProject = await ProjectModel.findByPk('nottarget')
    expect(nonUpdatedProject).toBeDefined()
    if (nonUpdatedProject) return

    expect(nonUpdatedProject.certificateFileId).toEqual(null)
  })

  it('should update project.certificateFileId on ProjectCertificateUploaded', async () => {
    await onProjectCertificate(models)(
      new ProjectCertificateUploaded({
        payload: {
          certificateFileId: 'certificateFile1',
          uploadedBy: 'user1',
          projectId: 'target',
        },
      })
    )

    const updatedProject = await ProjectModel.findByPk('target')
    expect(updatedProject.certificateFileId).toEqual('certificateFile1')

    const nonUpdatedProject = await ProjectModel.findByPk('nottarget')
    expect(nonUpdatedProject).toBeDefined()
    if (nonUpdatedProject) return

    expect(nonUpdatedProject.certificateFileId).toEqual(null)
  })
})
