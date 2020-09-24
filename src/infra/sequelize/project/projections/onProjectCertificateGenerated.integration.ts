import models from '../../models'
import { sequelize } from '../../../../sequelize.config'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import { InMemoryEventStore } from '../../../inMemory/eventStore'
import { onProjectCertificateGenerated } from './onProjectCertificateGenerated'
import { ProjectCertificateGenerated } from '../../../../modules/project/events'
import waitForExpect from 'wait-for-expect'

describe('project.onProjectCertificateGenerated', () => {
  const eventStore = new InMemoryEventStore()

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

  beforeAll(async () => {
    // Create the tables and remove all data
    await sequelize.sync({ force: true })

    await ProjectModel.bulkCreate(fakeProjects)
    await FileModel.create({
      id: 'certificateFile1',
      filename: '',
      designation: '',
    })
  })

  it('should update project.certificateFileId', async () => {
    onProjectCertificateGenerated(eventStore, models)

    await eventStore.publish(
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

    await waitForExpect(async () => {
      const updatedProject = await ProjectModel.findByPk('target')
      expect(updatedProject.certificateFileId).toEqual('certificateFile1')
    })

    const nonUpdatedProject = await ProjectModel.findByPk('nottarget')
    expect(nonUpdatedProject).toBeDefined()
    if (nonUpdatedProject) return

    expect(nonUpdatedProject.certificateFileId).toEqual(null)
  })
})
