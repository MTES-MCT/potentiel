import { resetDatabase } from '../../../helpers'
import { ProjectImported } from '@modules/project'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import models from '../../../models'
import { onProjectImported } from './onProjectImported'
import { UniqueEntityID } from '../../../../../core/domain'

describe('project.onProjectImported', () => {
  const projectId = new UniqueEntityID().toString()

  const fakeProject = makeFakeProject({ id: projectId, notifiedOn: 0 })
  delete fakeProject.potentielIdentifier

  const { appelOffreId, periodeId, numeroCRE, familleId } = fakeProject
  const { Project } = models

  beforeAll(async () => {
    await resetDatabase()

    expect(await Project.findByPk(projectId)).toEqual(null)

    await onProjectImported(models)(
      new ProjectImported({
        payload: {
          projectId: projectId,
          appelOffreId,
          periodeId,
          familleId,
          numeroCRE,
          potentielIdentifier: '',
          importId: '',
          data: fakeProject,
        },
        original: {
          version: 1,
          occurredAt: new Date(1234),
        },
      })
    )
  })

  it('should create a new project', async () => {
    const newProject = await Project.findByPk(projectId)
    expect(newProject).not.toEqual(null)

    expect(newProject).toMatchObject(fakeProject)
  })
})
