import models from '../../models'
import { sequelize } from '../../../../sequelize.config'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import { InMemoryEventStore } from '../../../inMemory/eventStore'
import { onProjectNotified } from './onProjectNotified'
import { ProjectNotified } from '../../../../modules/project/events'
import waitForExpect from 'wait-for-expect'

describe('project.onProjectNotified', () => {
  const eventStore = new InMemoryEventStore()

  const fakeProjects = [
    {
      id: 'target',
      notifiedOn: 0,
    },
    {
      id: 'nottarget',
      notifiedOn: 1,
    },
  ].map(makeFakeProject)

  const ProjectModel = models.Project

  beforeAll(async () => {
    // Create the tables and remove all data
    await sequelize.sync({ force: true })

    await ProjectModel.bulkCreate(fakeProjects)
  })

  it('should update project.notifiedOn', async () => {
    onProjectNotified(eventStore, models)

    await eventStore.publish(
      new ProjectNotified({
        payload: {
          appelOffreId: '',
          periodeId: '',
          familleId: '',
          projectId: 'target',
          notifiedOn: 123,
          candidateEmail: '',
        },
      })
    )

    await waitForExpect(async () => {
      const updatedProject = await ProjectModel.findByPk('target')
      expect(updatedProject.notifiedOn).toEqual(123)
    })

    const nonUpdatedProject = await ProjectModel.findByPk('nottarget')
    expect(nonUpdatedProject).toBeDefined()
    if (nonUpdatedProject) return

    expect(nonUpdatedProject.notifiedOn).toEqual(1)
  })
})
