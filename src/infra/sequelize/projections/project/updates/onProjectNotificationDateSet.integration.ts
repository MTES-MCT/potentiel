import { ProjectNotificationDateSet, ProjectNotified } from '../../../../../modules/project/events'
import { sequelize } from '../../../../../sequelize.config'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import models from '../../../models'
import { onProjectNotificationDateSet } from './onProjectNotificationDateSet'

describe('project.onProjectNotificationDateSet', () => {
  const fakeProjects = [
    {
      id: 'target',
      notifiedOn: 0,
    },
    {
      id: 'nottarget',
      notifiedOn: 0,
    },
  ].map(makeFakeProject)

  const ProjectModel = models.Project

  beforeEach(async () => {
    // Create the tables and remove all data
    await sequelize.sync({ force: true })

    await ProjectModel.bulkCreate(fakeProjects)
  })

  it('should update project.notifiedOn on ProjectNotificationDateSet', async () => {
    await onProjectNotificationDateSet(models)(
      new ProjectNotificationDateSet({
        payload: {
          projectId: 'target',
          setBy: 'user1',
          notifiedOn: 12345,
        },
      })
    )

    const updatedProject = await ProjectModel.findByPk('target')
    expect(updatedProject.notifiedOn).toEqual(12345)

    const nonUpdatedProject = await ProjectModel.findByPk('nottarget')
    expect(nonUpdatedProject).toBeDefined()
    if (nonUpdatedProject) return

    expect(nonUpdatedProject.notifiedOn).toEqual(0)
  })

  it('should update project.notifiedOn on ProjectNotified', async () => {
    await onProjectNotificationDateSet(models)(
      new ProjectNotified({
        payload: {
          projectId: 'target',
          notifiedOn: 56789,
          candidateEmail: '',
          candidateName: '',
          periodeId: '',
          appelOffreId: '',
          familleId: '',
        },
      })
    )

    const updatedProject = await ProjectModel.findByPk('target')
    expect(updatedProject.notifiedOn).toEqual(56789)

    const nonUpdatedProject = await ProjectModel.findByPk('nottarget')
    expect(nonUpdatedProject).toBeDefined()
    if (nonUpdatedProject) return

    expect(nonUpdatedProject.notifiedOn).toEqual(0)
  })
})
