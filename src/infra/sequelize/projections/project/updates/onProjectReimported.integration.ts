import { resetDatabase } from '../../../helpers'
import { ProjectReimported } from '../../../../../modules/project/events'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import models from '../../../models'
import { onProjectReimported } from './onProjectReimported'
import { UniqueEntityID } from '../../../../../core/domain'

describe('project.onProjectReimported', () => {
  const projectId = new UniqueEntityID().toString()

  const fakeProject = makeFakeProject({
    id: projectId,
    email: 'email',
    numeroCRE: 'numeroCRE',
    details: { param1: 'value1', param2: 'value2' },
  })
  delete fakeProject.potentielIdentifier

  const { Project } = models

  beforeAll(async () => {
    await resetDatabase()

    await Project.create(fakeProject)

    await onProjectReimported(models)(
      new ProjectReimported({
        payload: {
          projectId: projectId,
          importId: '',
          data: {
            email: 'email2',
            details: {
              param2: 'value2bis',
            },
          },
        },
        original: {
          version: 1,
          occurredAt: new Date(1234),
        },
      })
    )
  })

  it('should update the project with the delta', async () => {
    const updatedProject = await Project.findByPk(projectId)
    expect(updatedProject).not.toEqual(null)

    expect(updatedProject).toMatchObject({
      email: 'email2',
      numeroCRE: 'numeroCRE',
      details: {
        param1: 'value1',
        param2: 'value2bis',
      },
    })
  })
})
