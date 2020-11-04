import {
  ProjectCertificateGenerated,
  ProjectCertificateUpdated,
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

  it('should update project.certificateFileId on ProjectCertificateUpdated', async () => {
    await onProjectCertificate(models)(
      new ProjectCertificateUpdated({
        payload: {
          certificateFileId: 'certificateFile1',
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
