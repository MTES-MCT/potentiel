import { UniqueEntityID } from '@core/domain'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import { resetDatabase } from '../../helpers'
import models from '../../models'
import { getProjectDataForModifierIdentifiantGestionnaireReseauPage } from './getProjectDataForModifierIdentifiantGestionnaireReseauPage'

const { Project } = models
const projectId = new UniqueEntityID().toString()

describe("Récupérer les données pour la page de modification de l'identifiant du gestionnaire de réseau", () => {
  it(`Lorsqu'on récupère les données pour la page de modification de l'identifiant du gestionnaire de réseau"
      Alors l'identifiant du projet devrait être retourné
      Et l'identifiant du gestionnaire de réseau devrait être retourné
      `, async () => {
    await resetDatabase()

    await Project.create(
      makeFakeProject({
        id: projectId,
        numeroGestionnaire: 'identifiant',
      })
    )

    const résultat = (
      await getProjectDataForModifierIdentifiantGestionnaireReseauPage(projectId)
    )._unsafeUnwrap()

    expect(résultat).toMatchObject({
      id: projectId,
      numeroGestionnaire: 'identifiant',
    })
  })
})
