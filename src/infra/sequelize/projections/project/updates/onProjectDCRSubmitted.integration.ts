import { resetDatabase } from '../../../helpers'
import { ProjectDCRSubmitted } from '@modules/project'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import models from '../../../models'
import { onProjectDCRSubmitted } from './onProjectDCRSubmitted'
import { UniqueEntityID } from '../../../../../core/domain'

describe('project.onProjectDCRSubmitted', () => {
  const projectId = new UniqueEntityID().toString()

  const fakeProjects = [
    {
      id: projectId,
    },
  ].map(makeFakeProject)

  const ProjectModel = models.Project

  beforeAll(async () => {
    await resetDatabase()
    await ProjectModel.bulkCreate(fakeProjects)
  })

  it('should update project.numeroGestionnaire with numeroDossier if provided', async () => {
    const originalProject = await ProjectModel.findByPk(projectId)
    expect(originalProject.numeroGestionnaire).toEqual(null)

    await onProjectDCRSubmitted(models)(
      new ProjectDCRSubmitted({
        payload: {
          projectId: projectId,
          dcrDate: new Date(123),
          fileId: new UniqueEntityID().toString(),
          submittedBy: new UniqueEntityID().toString(),
          numeroDossier: 'numero dossier',
        },
      })
    )

    const updatedProject = await ProjectModel.findByPk(projectId)
    expect(updatedProject.numeroGestionnaire).toEqual('numero dossier')
  })
})
