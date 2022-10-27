import models from '../../../models'
import { resetDatabase } from '../../../helpers'
import { onProjectGFInvalidated } from './onProjectGFInvalidated'
import { ProjectGFInvalidated } from '@modules/project'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { UniqueEntityID } from '@core/domain'

describe('project.onProjectGFInvalidated', () => {
  const { Project } = models
  const projectId = new UniqueEntityID().toString()

  beforeEach(async () => {
    await resetDatabase()
  })

  it(`Etant donné un projet avec un fichier de garanties financières
      Lorsqu'un évènement ProjectGFInvalidated survient
      Alors le fichier de garanties financières devrait être retiré du project`, async () => {
    await Project.create(
      makeFakeProject({
        id: projectId,
        garantiesFinancieresFileId: new UniqueEntityID().toString(),
      })
    )

    await onProjectGFInvalidated(models)(
      new ProjectGFInvalidated({
        payload: { projectId },
      })
    )

    const project = await Project.findByPk(projectId)
    expect(project.garantiesFinancieresFileId).toBeNull()
  })

  it(`Etant donné un projet sans fichier de garanties financières
      Lorsqu'un évènement ProjectGFInvalidated survient
      Alors le projet devrait rester sans garanties financières`, async () => {
    await Project.create(
      makeFakeProject({
        id: projectId,
        garantiesFinancieresFileId: null,
      })
    )

    await onProjectGFInvalidated(models)(
      new ProjectGFInvalidated({
        payload: { projectId },
      })
    )

    const project = await Project.findByPk(projectId)
    expect(project.garantiesFinancieresFileId).toBeNull()
  })
})
