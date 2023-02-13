import { UniqueEntityID } from '@core/domain'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import { resetDatabase } from '../../helpers'
import models from '../../models'
import { getProjectDataForModifierIdentifiantGestionnaireReseauPage } from './getProjectDataForModifierIdentifiantGestionnaireReseauPage'

const { Project } = models
const projetId = new UniqueEntityID().toString()
const notifiedOn = new Date('2023-02-01').getTime()
const donnéesProjetAttendues = {
  id: projetId,
  nomProjet: 'Mon projet PV',
  nomCandidat: 'Mr Porter',
  communeProjet: 'communeProjet',
  regionProjet: 'regionProjet',
  departementProjet: 'departementProjet',
  periodeId: '2',
  familleId: '1',
  notifiedOn,
  appelOffreId: 'Fessenheim',
}

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
    await Project.create(
      makeFakeProject({
        id: projetId,
        numeroGestionnaire: 'identifiant',
        notifiedOn,
      })
    )

    const résultat = (
      await getProjectDataForModifierIdentifiantGestionnaireReseauPage(projetId)
    )._unsafeUnwrap()

    expect(résultat).toMatchObject({
      ...donnéesProjetAttendues,
      numeroGestionnaire: 'identifiant',
    })
  })

  it(`
  Étant donné un projet sans identifiant de gestionnaire de réseau
  Lorsqu'on récupère les données pour la page de modification de gestionnaire réseau
  Alors uniquement l'identifiant du projet devrait être retourné
  `, async () => {
    await Project.create(
      makeFakeProject({
        id: projetId,
        notifiedOn,
      })
    )

    const résultat = (
      await getProjectDataForModifierIdentifiantGestionnaireReseauPage(projetId)
    )._unsafeUnwrap()

    expect(résultat).toMatchObject(donnéesProjetAttendues)
  })
})
