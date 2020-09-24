import waitForExpect from 'wait-for-expect'
import models from '../../models'
import { sequelize } from '../../../../sequelize.config'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import { InMemoryEventStore } from '../../../inMemory/eventStore'
import { onProjectDCRDueDateSet } from './onProjectDCRDueDateSet'
import { ProjectDCRDueDateSet } from '../../../../modules/project/events'

describe('project.onProjectDCRDueDateSet', () => {
  const eventStore = new InMemoryEventStore()

  const fakeProjects = [
    {
      id: 'target',
      dcrDueOn: 0,
    },
    {
      id: 'nottarget',
      dcrDueOn: 0,
    },
  ].map(makeFakeProject)

  const ProjectModel = models.Project

  beforeAll(async () => {
    // Create the tables and remove all data
    await sequelize.sync({ force: true })

    await ProjectModel.bulkCreate(fakeProjects)
  })

  it('should update project.dcrDueOn', async () => {
    onProjectDCRDueDateSet(eventStore, models)

    await eventStore.publish(
      new ProjectDCRDueDateSet({
        payload: {
          projectId: 'target',
          dcrDueOn: 12345,
        },
      })
    )

    await waitForExpect(async () => {
      const updatedProject = await ProjectModel.findByPk('target')
      expect(updatedProject.dcrDueOn).toEqual(12345)
    })

    const nonUpdatedProject = await ProjectModel.findByPk('nottarget')
    expect(nonUpdatedProject).toBeDefined()
    if (nonUpdatedProject) return

    expect(nonUpdatedProject.dcrDueOn).toEqual(0)
  })
})
