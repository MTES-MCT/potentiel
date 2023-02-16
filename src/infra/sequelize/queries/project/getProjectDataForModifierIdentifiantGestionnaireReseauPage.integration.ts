import { UniqueEntityID } from '@core/domain'
import { Raccordements } from '@infra/sequelize'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import { resetDatabase } from '../../helpers'
import models from '../../models'
import * as uuid from 'uuid'
import { getProjectDataForModifierIdentifiantGestionnaireReseauPage } from './getProjectDataForModifierIdentifiantGestionnaireReseauPage'
import { ProjectDataForModifierIdentifiantGestionnaireReseauPage } from '@modules/project'

const { Project } = models
const projetId = new UniqueEntityID().toString()
const notifiedOn = new Date('2023-02-01').getTime()

const fakeProjet = makeFakeProject({ id: projetId, notifiedOn })

describe("Récupérer les données pour la page de modification de l'identifiant du gestionnaire de réseau", () => {
  beforeEach(async () => {
    await resetDatabase()
  })

  it(`
  Étant donné un projet ayant déjà un identifiant de gestionnaire de réseau
  Lorsqu'on récupère les données pour la page de modification de gestionnaire réseau
  Alors l'identifiant du projet devrait être retourné
  Et l'identifiant du gestionnaire de réseau devrait être retourné
      `, async () => {
    // Arrange
    await Project.create(fakeProjet)
    const identifiantGestionnaire = 'identifiant'

    await Raccordements.create({
      projetId: fakeProjet.id,
      id: uuid.v4(),
      identifiantGestionnaire,
    })

    // Act
    const résultat = await getProjectDataForModifierIdentifiantGestionnaireReseauPage(projetId)
    console.log(résultat)
    expect(résultat.isOk()).toBe(true)

    // Assert
    const expected: ProjectDataForModifierIdentifiantGestionnaireReseauPage = {
      id: fakeProjet.id,
      nomProjet: fakeProjet.nomProjet,
      nomCandidat: fakeProjet.nomCandidat,
      communeProjet: fakeProjet.communeProjet,
      regionProjet: fakeProjet.regionProjet,
      departementProjet: fakeProjet.departementProjet,
      periodeId: fakeProjet.periodeId,
      familleId: fakeProjet.familleId,
      notifiedOn,
      appelOffreId: fakeProjet.appelOffreId,
      identifiantGestionnaire,
    }

    expect(résultat._unsafeUnwrap()).toEqual(expected)
  })

  it(`
  Étant donné un projet sans identifiant de gestionnaire de réseau
  Lorsqu'on récupère les données pour la page de modification de gestionnaire réseau
  Alors uniquement l'identifiant du projet devrait être retourné
  `, async () => {
    await Project.create(fakeProjet)

    const résultat = await getProjectDataForModifierIdentifiantGestionnaireReseauPage(projetId)

    expect(résultat.isOk()).toBe(true)

    expect(résultat._unsafeUnwrap()).toMatchObject({
      id: fakeProjet.id,
      nomProjet: fakeProjet.nomProjet,
      nomCandidat: fakeProjet.nomCandidat,
      communeProjet: fakeProjet.communeProjet,
      regionProjet: fakeProjet.regionProjet,
      departementProjet: fakeProjet.departementProjet,
      periodeId: fakeProjet.periodeId,
      familleId: fakeProjet.familleId,
      notifiedOn,
      appelOffreId: fakeProjet.appelOffreId,
    })
  })
})
