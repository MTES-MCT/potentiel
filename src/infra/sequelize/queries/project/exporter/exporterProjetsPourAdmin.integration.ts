// import { Colonne } from './Colonne'
import models from '../../../models'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { exporterProjets } from './exporterProjets'
import { resetDatabase } from '@dataAccess'

import {
  contenuLocal,
  coordonnéesCandidat,
  coordonnéesGéodésiques,
  coûtInvestissement,
  donnéesAutoconsommation,
  donnéesDeRaccordement,
  donnéesFournisseurs,
  financementCitoyen,
  garantiesFinancières,
  identificationProjet,
  implantation,
  instruction,
  localisationProjet,
  modificationsAvantImport,
  noteInnovation,
  notes,
  potentielSolaire,
  prix,
  référencesCandidature,
  résultatInstructionSensible,
  évaluationCarbone,
} from './colonnesParCatégorie'

describe(`Export des projets`, () => {
  beforeEach(resetDatabase)

  const colonnesÀExporter = [
    ...identificationProjet,
    ...coordonnéesCandidat,
    ...financementCitoyen,
    ...contenuLocal,
    ...localisationProjet,
    ...coordonnéesGéodésiques,
    ...coûtInvestissement,
    ...donnéesAutoconsommation,
    ...donnéesDeRaccordement,
    ...donnéesFournisseurs,
    ...évaluationCarbone,
    ...potentielSolaire,
    ...implantation,
    ...prix,
    ...référencesCandidature,
    ...instruction,
    ...résultatInstructionSensible,
    ...noteInnovation,
    ...notes,
    ...modificationsAvantImport,
    ...garantiesFinancières,
  ].map((c) => (c.details ? c.champ : c.intitulé))

  describe(`Exporter des projets`, () => {
    it(`Étant donné des projets notifiés et non notifiés avec des détails
        Lorsqu'un admin/dgec exporte tous les projets
        Alors tous les projets devrait être récupérés avec la liste des intitulés des colonnes exportées`, async () => {
      await models.Project.bulkCreate([
        makeFakeProject({
          notifiedOn: new Date('2021-07-31').getTime(),
          nomProjet: 'Projet Eolien',
          prixReference: 12,
          details: {
            'Prix Majoré': '90',
            'Prix de référence (€/MWh)': '42',
            'Contenu local européen (%)\n(Plaquettes de silicium (wafers))': 'truc',
          },
        }),
        makeFakeProject({
          notifiedOn: 0,
          nomProjet: 'Projet Photovoltaïque',
          prixReference: 1,
          details: {
            'Prix Majoré': '2',
            'Prix de référence (€/MWh)': '3',
          },
        }),
        makeFakeProject({
          notifiedOn: new Date('2021-07-31').getTime(),
          nomProjet: 'Autre',
          prixReference: 24,
          details: {
            'Prix Majoré': '56',
            'Prix de référence (€/MWh)': '876',
          },
        }),
      ])

      const exportProjets = await exporterProjets({ role: 'admin' })

      if (exportProjets.isErr()) {
        console.error(exportProjets.error)
        return
      }

      expect(exportProjets.value.colonnes).toEqual(colonnesÀExporter)

      expect(exportProjets.value.données).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            'Nom projet': 'Projet Eolien',
            'Prix Majoré': '90',
            'Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)': 12,
            'Prix de référence (€/MWh)': '42',
            'Contenu local européen (%)\n(Plaquettes de silicium (wafers))': 'truc',
            Notification: '31/07/2021',
          }),
          expect.objectContaining({
            'Nom projet': 'Projet Photovoltaïque',
            'Prix Majoré': '2',
            'Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)': 1,
            'Prix de référence (€/MWh)': '3',
            Notification: '',
          }),
          expect.objectContaining({
            'Nom projet': 'Autre',
            'Prix Majoré': '56',
            'Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)': 24,
            'Prix de référence (€/MWh)': '876',
            Notification: '31/07/2021',
          }),
        ])
      )
    })
  })

  // describe(`Filtrer un export`, () => {
  //   describe(`Filtrer un export de projets par nom de projet`, () => {
  //     it(`Étant donné des projets avec des détails complets
  //       Lorsque on récupère un export pour un projet nommé "Projet"
  //       Alors un export devrait être récupéré avec seulement les données des projet dont le nom contient 'Projet'`, async () => {
  //       await models.Project.bulkCreate([
  //         makeFakeProject({
  //           nomProjet: 'Projet Eolien',
  //           prixReference: 12,
  //           details: { 'Prix Majoré': '90', 'Prix de référence (€/MWh)': '42' },
  //         }),
  //         makeFakeProject({
  //           nomProjet: 'Projet Photovoltaïque',
  //           prixReference: 1,
  //           details: { 'Prix Majoré': '2', 'Prix de référence (€/MWh)': '3' },
  //         }),
  //         makeFakeProject({
  //           nomProjet: 'Autre',
  //           prixReference: 24,
  //           details: { 'Prix Majoré': '56', 'Prix de référence (€/MWh)': '876' },
  //         }),
  //       ])

  //       const colonnesÀExporter: Readonly<Array<Colonne>> = [
  //         {
  //           champ: `Prix Majoré`,
  //           details: true,
  //         },
  //         {
  //           champ: 'prixReference',
  //           intitulé: 'Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)',
  //         },
  //         {
  //           champ: `Prix de référence (€/MWh)`,
  //           details: true,
  //         },
  //       ]

  //       const exportProjets = (
  //         await récupérerExportProjets({
  //           colonnesÀExporter,
  //           filtres: { recherche: 'Projet' },
  //         })
  //       )._unsafeUnwrap()

  //       expect(exportProjets.données).toEqual([
  //         { 'Prix Majoré': '90', 'Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)': 12, 'Prix de référence (€/MWh)': '42' },
  //         { 'Prix Majoré': '2', 'Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)': 1, 'Prix de référence (€/MWh)': '3' },
  //       ])
  //     })
  //   })
  // })
})
