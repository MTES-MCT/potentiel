import models from '../../../models'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { exporterProjets } from './exporterProjets'
import { resetDatabase } from '@dataAccess'
import { v4 as uuid } from 'uuid'

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
  localisationProjet,
  modificationsAvantImport,
  potentielSolaire,
  prix,
  résultatInstructionSensible,
  évaluationCarbone,
} from './colonnesParCatégorie'
import { User } from '@entities'

describe(`Export des projets en tant que porteur de projet`, () => {
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
    ...résultatInstructionSensible,
    ...modificationsAvantImport,
    ...garantiesFinancières,
  ].map((c) => (c.source === 'propriété-colonne-détail' ? c.nomPropriété : c.intitulé))

  it(`Étant donné des projets notifiés et non notifiés
        Lorsqu'un porteur de projet exporte tous les projets
        Alors seulement les projets notifiés auxquels il a accès devrait être récupérés avec la liste des intitulés des colonnes exportées`, async () => {
    const userId = uuid()
    const idProjet1DuPorteur = uuid()
    const idProjet2DuPorteur = uuid()
    const idProjet3DuPorteur = uuid()
    const idProjet1AutrePorteur = uuid()
    const idProjet2AutrePorteur = uuid()

    await models.Project.bulkCreate([
      makeFakeProject({
        id: idProjet1DuPorteur,
        notifiedOn: new Date('2021-07-31').getTime(),
        nomProjet: 'Projet Notifié Eolien du porteur',
      }),
      makeFakeProject({
        id: idProjet1AutrePorteur,
        notifiedOn: 0,
        nomProjet: `Projet Non Notifié Photovoltaïque à quelqu'un d'autre`,
      }),
      makeFakeProject({
        id: idProjet2AutrePorteur,
        notifiedOn: new Date('2021-07-31').getTime(),
        nomProjet: `Projet Notifié Photovoltaïque à quelqu'un d'autre`,
      }),
      makeFakeProject({
        id: idProjet2DuPorteur,
        notifiedOn: new Date('2021-07-31').getTime(),
        nomProjet: 'Autre Projet Notifié du porteur',
      }),
      makeFakeProject({
        id: idProjet3DuPorteur,
        notifiedOn: 0,
        nomProjet: 'Autre Non Notifié du porteur',
      }),
    ])
    await models.UserProjects.bulkCreate([
      { userId, projectId: idProjet1DuPorteur },
      { userId, projectId: idProjet2DuPorteur },
      { userId, projectId: idProjet3DuPorteur },
      { userId: uuid(), projectId: idProjet1AutrePorteur },
      { userId: uuid(), projectId: idProjet2AutrePorteur },
    ])

    const exportProjets = (
      await exporterProjets({ user: { id: userId, role: 'porteur-projet' } as User })
    )._unsafeUnwrap()

    expect(exportProjets.colonnes).toEqual(colonnesÀExporter)

    expect(exportProjets.données).toHaveLength(2)
    expect(exportProjets.données).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          'Nom projet': 'Projet Notifié Eolien du porteur',
        }),
        expect.objectContaining({
          'Nom projet': 'Autre Projet Notifié du porteur',
        }),
      ])
    )
    expect(exportProjets.données).not.toContain(
      expect.objectContaining({
        'Nom projet': `Projet Non Notifié Photovoltaïque à quelqu'un d'autre`,
      })
    )
    expect(exportProjets.données).not.toContain(
      expect.objectContaining({
        'Nom projet': `Projet Notifié Photovoltaïque à quelqu'un d'autre`,
      })
    )
    expect(exportProjets.données).not.toContain(
      expect.objectContaining({
        'Nom projet': 'Autre Non Notifié du porteur',
      })
    )
  })
})
