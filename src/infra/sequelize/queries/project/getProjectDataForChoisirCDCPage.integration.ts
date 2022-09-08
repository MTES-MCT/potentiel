import { UniqueEntityID } from '@core/domain'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import { resetDatabase } from '../../helpers'
import models from '../../models'
import { getProjectDataForChoisirCDCPage } from '@infra/sequelize/queries/project'

const { Project } = models

const projectId = new UniqueEntityID().toString()
const projectInfo = {
  id: projectId,
  appelOffreId: 'Fessenheim',
  periodeId: '1',
  familleId: 'familleId',
  classe: 'Classé',
  newRulesOptIn: false,
}

describe('Sequelize getProjectDataForChoisirCDCPage', () => {
  it('doit retourner un ProjectDataForChoisirCDCPage dto', async () => {
    await resetDatabase()

    await Project.create(makeFakeProject(projectInfo))

    const res = (await getProjectDataForChoisirCDCPage(projectId))._unsafeUnwrap()

    expect(res).toMatchObject({
      id: projectId,
      appelOffreId: 'Fessenheim',
      periodeId: '1',
      familleId: 'familleId',
      newRulesOptIn: false,
      isClasse: true,
    })
  })
})
