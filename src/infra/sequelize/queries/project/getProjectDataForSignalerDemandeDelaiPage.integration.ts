import { getProjectDataForSignalerDemandeDelaiPage } from './getProjectDataForSignalerDemandeDelaiPage'
import { UniqueEntityID } from '@core/domain'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import { resetDatabase } from '../../helpers'
import models from '../../models'

const { Project, ModificationRequest } = models
const projectId = new UniqueEntityID().toString()
const projectInfo = makeFakeProject({
  id: projectId,
  nomProjet: 'nomProjet',
  completionDueOn: new Date(5678).getTime(),
})
const modificationRequest = {
  id: new UniqueEntityID().toString(),
  projectId,
  type: 'delai',
  status: 'envoyée',
}

describe('Sequelize getProjectDataForSignalerDemandeDelaiPage', () => {
  it('should return a ProjectDataForSignalerDemandeDelaiPage dto', async () => {
    await resetDatabase()

    await Project.create(makeFakeProject(projectInfo))
    await ModificationRequest.create(modificationRequest)

    const res = (await getProjectDataForSignalerDemandeDelaiPage({ projectId }))._unsafeUnwrap()

    expect(res).toMatchObject({
      id: projectId,
      nomProjet: 'nomProjet',
      completionDueOn: new Date(5678),
      hasPendingDemandeDelai: true,
    })
  })

  for (const status of ['acceptée', 'rejetée', 'annulée']) {
    describe(`when a project has a modification request of type 'delai' with status '${status}'`, () => {
      const pendingModificationRequest = {
        ...modificationRequest,
        status,
      }

      it('should return ProjectDataForSignalerDemandeDelaiPage dto with hasPendingDemandeDelai to false', async () => {
        await resetDatabase()

        await Project.create(projectInfo)
        await ModificationRequest.create(pendingModificationRequest)

        const res = (await getProjectDataForSignalerDemandeDelaiPage({ projectId }))._unsafeUnwrap()

        expect(res).toMatchObject({
          hasPendingDemandeDelai: false,
        })
      })
    })
  }
})
