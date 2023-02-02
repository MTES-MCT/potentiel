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

describe(`Export des projets en tant qu'utilisateur "admin" ou "dgec-validateur"`, () => {
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
  ].map((c) => (c.source === 'propriété-colonne-détail' ? c.nomPropriété : c.intitulé))

  for (const role of ['admin', 'dgec-validateur'] as const) {
    it(`Étant donné des projets notifiés et non notifiés avec des détails
        Lorsqu'un ${role} exporte tous les projets
        Alors tous les projets devrait être récupérés avec la liste des intitulés des colonnes exportées
        Et les donnèes formatées pour l'export devrait être récupérées`, async () => {
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

      const exportProjets = await exporterProjets({ role })

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
  }
})
