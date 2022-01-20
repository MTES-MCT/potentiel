import { resetDatabase } from '../../../helpers'
import { ProjectNotificationDateSet, ProjectNotified } from '@modules/project'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import models from '../../../models'
import { onProjectNotificationDateSet } from './onProjectNotificationDateSet'
import { v4 as uuid } from 'uuid'

describe('project.onProjectNotificationDateSet', () => {
  const projectId = uuid()
  const fakeProjectId = uuid()

  const fakeProjects = [
    {
      id: projectId,
      notifiedOn: 0,
    },
    {
      id: fakeProjectId,
      notifiedOn: 0,
    },
  ].map(makeFakeProject)

  const ProjectModel = models.Project

  beforeEach(async () => {
    await resetDatabase()
    await ProjectModel.bulkCreate(fakeProjects)
  })

  it('should update project.notifiedOn on ProjectNotificationDateSet', async () => {
    await onProjectNotificationDateSet(models)(
      new ProjectNotificationDateSet({
        payload: {
          projectId,
          setBy: 'user1',
          notifiedOn: 12345,
        },
      })
    )

    const updatedProject = await ProjectModel.findByPk(projectId)
    expect(updatedProject.notifiedOn).toEqual(12345)

    const nonUpdatedProject = await ProjectModel.findByPk(fakeProjectId)
    expect(nonUpdatedProject).toBeDefined()
    if (nonUpdatedProject) return

    expect(nonUpdatedProject.notifiedOn).toEqual(0)
  })

  it('should update project.notifiedOn on ProjectNotified', async () => {
    await onProjectNotificationDateSet(models)(
      new ProjectNotified({
        payload: {
          projectId,
          notifiedOn: 56789,
          candidateEmail: '',
          candidateName: '',
          periodeId: '',
          appelOffreId: '',
          familleId: '',
        },
      })
    )

    const updatedProject = await ProjectModel.findByPk(projectId)
    expect(updatedProject.notifiedOn).toEqual(56789)

    const nonUpdatedProject = await ProjectModel.findByPk(fakeProjectId)
    expect(nonUpdatedProject).toBeDefined()
    if (nonUpdatedProject) return

    expect(nonUpdatedProject.notifiedOn).toEqual(0)
  })
})
