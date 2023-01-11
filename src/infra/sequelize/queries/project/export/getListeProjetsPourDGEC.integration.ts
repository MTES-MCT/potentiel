import { resetDatabase } from '@infra/sequelize/helpers'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { getProjetsListePourDGEC } from './getListeProjetsPourDGEC'
import models from '../../../models'

describe(`Requête getProjectsListeCsvPourDGEC`, () => {
  const { Project } = models

  beforeEach(async () => {
    await resetDatabase()
  })

  describe(`Données accessibles à la racine de la table`, () => {
    it(`Etant donné un utilisateur admin ayant la permission pour afficher les données suivantes
    pour tous les projets :
    'numeroCRE', 'appelOffreId', 'periodeId',
  alors ces données pour tous les projets devraient être retournées.`, async () => {
      const projet1 = makeFakeProject({
        appelOffreId: 'Innovation',
        periodeId: '1',
        numeroCRE: '200',
        familleId: '1',
      })

      const projet2 = makeFakeProject({
        appelOffreId: 'CRE4 - Bâtiment',
        periodeId: '1',
        numeroCRE: '201',
        familleId: '2',
      })

      await Project.bulkCreate([projet1, projet2])

      const listeColonnes = ['numeroCRE', 'appelOffreId', 'periodeId']

      const résultat = await getProjetsListePourDGEC(listeColonnes)
      expect(résultat._unsafeUnwrap()).toHaveLength(2)

      expect(résultat._unsafeUnwrap()).toEqual([
        { numeroCRE: '200', appelOffreId: 'Innovation', periodeId: '1' },
        {
          numeroCRE: '201',
          appelOffreId: 'CRE4 - Bâtiment',
          periodeId: '1',
        },
      ])
    })
  })

  describe(`Données accessibles dans la colonne "details"`, () => {
    it(`Etant donné un utilisateur admin ayant la permission pour accéder à la donnée
    "nouvelleDonnées" imbriquée dans "details"
    de tous les projets,
    alors cette donnée devrait être retournée au même niveau que les autres données`, async () => {
      const projet = makeFakeProject({
        appelOffreId: 'Innovation',
        periodeId: '1',
        numeroCRE: '200',
        familleId: '1',
        details: { nouvelleDonnée: 'valeurAttendue' },
      })

      await Project.create(projet)

      const listeColonnes = ['nouvelleDonnée', 'numeroCRE']

      const résultat = await getProjetsListePourDGEC(listeColonnes)

      expect(résultat._unsafeUnwrap()).toEqual([
        {
          nouvelleDonnée: 'valeurAttendue',
          numeroCRE: '200',
        },
      ])
    })
  })
})
