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
import { User } from '@entities'

describe(`Export des projets en tant qu'utilisateur "CRE"`, () => {
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

  it(`Étant donné des projets notifiés et non notifiés
        Lorsqu'un utilisateur CRE exporte tous les projets
        Alors tous les projets devrait être récupérés avec la liste des intitulés des colonnes exportées`, async () => {
    await models.Project.bulkCreate([
      makeFakeProject({
        notifiedOn: new Date('2021-07-31').getTime(),
        nomProjet: 'Projet Eolien',
      }),
      makeFakeProject({
        notifiedOn: 0,
        nomProjet: 'Projet Non notifié Photovoltaïque',
      }),
      makeFakeProject({
        notifiedOn: new Date('2021-07-31').getTime(),
        nomProjet: 'Autre',
      }),
    ])

    const exportProjets = (
      await exporterProjets({ user: { id: 'user-id', role: 'cre' } as User })
    )._unsafeUnwrap()

    expect(exportProjets.colonnes).toEqual(colonnesÀExporter)

    expect(exportProjets.données).toHaveLength(3)
    expect(exportProjets.données).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          'Nom projet': 'Projet Eolien',
        }),
        expect.objectContaining({
          'Nom projet': 'Projet Non notifié Photovoltaïque',
        }),
        expect.objectContaining({
          'Nom projet': 'Autre',
        }),
      ])
    )
  })
})
