import { UniqueEntityID } from '@core/domain'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import { resetDatabase } from '../../helpers'
import models from '../../models'
import { getProjectDataForChoisirCDCPage } from '@infra/sequelize/queries/project'
import { getProjectAppelOffre } from '@config/queryProjectAO.config'

const { Project } = models
const projectId = new UniqueEntityID().toString()

describe('Récupérer les données pour la page du choix du cahier des charges', () => {
  it(`Lorsqu'on récupère les données pour la page du choix des CDC
      Alors l'identifiant du projet devrait être retourné
      Et l'appel d'offre pour le projet devrait être retrourné
      Et le cahier des charges actuel devrait être retourné`, async () => {
    await resetDatabase()

    await Project.create(
      makeFakeProject({
        id: projectId,
        appelOffreId: 'Fessenheim',
        periodeId: '1',
        familleId: 'familleId',
        classe: 'Classé',
        cahierDesChargesActuel: '30/07/2021',
      })
    )

    const res = (await getProjectDataForChoisirCDCPage(projectId))._unsafeUnwrap()

    expect(res).toMatchObject({
      id: projectId,
      appelOffre: getProjectAppelOffre({ appelOffreId: 'Fessenheim', periodeId: '1' }),
      cahierDesChargesActuel: '30/07/2021',
    })
  })
})
