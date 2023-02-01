import { Colonne } from '../Colonne'
import models from '../../../../models'
import makeFakeProject from '../../../../../../__tests__/fixtures/project'
import { récupérerExportProjets } from './récupérerExportProjets'
import { resetDatabase } from '@dataAccess'

describe(`Récupérer un export de projets`, () => {
  beforeEach(resetDatabase)

  describe(`Récupérer un export de projets`, () => {
    it(`Étant donné des projets avec des détails complets
        Lorsque on récupère un export avec des colonnes précises
        Alors un export devrait être récupéré avec la liste des intitulés des colonnes exportées
        Et un export devrait être récupéré avec seulement les données des colonnes voulues pour l'export`, async () => {
      await models.Project.bulkCreate([
        makeFakeProject({
          nomProjet: 'Projet Eolien',
          prixReference: 12,
          details: { 'Prix Majoré': '90', 'Prix de référence (€/MWh)': '42' },
        }),
        makeFakeProject({
          nomProjet: 'Projet Photovoltaïque',
          prixReference: 1,
          details: { 'Prix Majoré': '2', 'Prix de référence (€/MWh)': '3' },
        }),
        makeFakeProject({
          nomProjet: 'Autre',
          prixReference: 24,
          details: { 'Prix Majoré': '56', 'Prix de référence (€/MWh)': '876' },
        }),
      ])

      const colonnesÀExporter: Readonly<Array<Colonne>> = [
        {
          champ: `Prix Majoré`,
          details: true,
        },
        {
          champ: 'prixReference',
          intitulé: 'Prix de référence',
        },
        {
          champ: `Prix de référence (€/MWh)`,
          details: true,
        },
      ]

      const exportProjets = (await récupérerExportProjets({ colonnesÀExporter }))._unsafeUnwrap()

      expect(exportProjets.colonnes).toEqual([
        'Prix Majoré',
        'Prix de référence',
        'Prix de référence (€/MWh)',
      ])

      expect(exportProjets.données).toEqual([
        { 'Prix Majoré': '90', 'Prix de référence': 12, 'Prix de référence (€/MWh)': '42' },
        { 'Prix Majoré': '2', 'Prix de référence': 1, 'Prix de référence (€/MWh)': '3' },
        { 'Prix Majoré': '56', 'Prix de référence': 24, 'Prix de référence (€/MWh)': '876' },
      ])
    })
  })

  describe(`Filtrer un export`, () => {
    describe(`Filtrer un export de projets par nom de projet`, () => {
      it(`Étant donné des projets avec des détails complets 
        Lorsque on récupère un export pour un projet nommé "Projet"
        Alors un export devrait être récupéré avec seulement les données des projet dont le nom contient 'Projet'`, async () => {
        await models.Project.bulkCreate([
          makeFakeProject({
            nomProjet: 'Projet Eolien',
            prixReference: 12,
            details: { 'Prix Majoré': '90', 'Prix de référence (€/MWh)': '42' },
          }),
          makeFakeProject({
            nomProjet: 'Projet Photovoltaïque',
            prixReference: 1,
            details: { 'Prix Majoré': '2', 'Prix de référence (€/MWh)': '3' },
          }),
          makeFakeProject({
            nomProjet: 'Autre',
            prixReference: 24,
            details: { 'Prix Majoré': '56', 'Prix de référence (€/MWh)': '876' },
          }),
        ])

        const colonnesÀExporter: Readonly<Array<Colonne>> = [
          {
            champ: `Prix Majoré`,
            details: true,
          },
          {
            champ: 'prixReference',
            intitulé: 'Prix de référence',
          },
          {
            champ: `Prix de référence (€/MWh)`,
            details: true,
          },
        ]

        const exportProjets = (
          await récupérerExportProjets({
            colonnesÀExporter,
            filtres: { recherche: 'Projet' },
          })
        )._unsafeUnwrap()

        expect(exportProjets.données).toEqual([
          { 'Prix Majoré': '90', 'Prix de référence': 12, 'Prix de référence (€/MWh)': '42' },
          { 'Prix Majoré': '2', 'Prix de référence': 1, 'Prix de référence (€/MWh)': '3' },
        ])
      })
    })
  })
})
