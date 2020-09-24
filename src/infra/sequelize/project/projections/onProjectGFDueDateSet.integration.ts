import models from '../../models'
import { sequelize } from '../../../../sequelize.config'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import { InMemoryEventStore } from '../../../inMemory/eventStore'
import { onProjectGFDueDateSet } from './onProjectGFDueDateSet'
import { ProjectGFDueDateSet } from '../../../../modules/project/events'

import waitForExpect from 'wait-for-expect'

describe('project.onProjectGFDueDateSet', () => {
  const eventStore = new InMemoryEventStore()

  const fakeProjects = [
    {
      id: 'target',
      garantiesFinancieresDueOn: 0,
    },
    {
      id: 'nottarget',
      garantiesFinancieresDueOn: 0,
    },
  ].map(makeFakeProject)

  const ProjectModel = models.Project

  beforeAll(async () => {
    // Create the tables and remove all data
    await sequelize.sync({ force: true })

    await ProjectModel.bulkCreate(fakeProjects)
  })

  it('should update project.garantiesFinancieresDueOn', async () => {
    onProjectGFDueDateSet(eventStore, models)

    await eventStore.publish(
      new ProjectGFDueDateSet({
        payload: {
          projectId: 'target',
          garantiesFinancieresDueOn: 12345,
        },
      })
    )

    await waitForExpect(async () => {
      const updatedProject = await ProjectModel.findByPk('target')
      expect(updatedProject.garantiesFinancieresDueOn).toEqual(12345)
    })

    const nonUpdatedProject = await ProjectModel.findByPk('nottarget')
    expect(nonUpdatedProject).toBeDefined()
    if (nonUpdatedProject) return

    expect(nonUpdatedProject.garantiesFinancieresDueOn).toEqual(0)
  })
})
