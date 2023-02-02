import models from '../../../models'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { exporterProjets } from './exporterProjets'
import { resetDatabase } from '@dataAccess'

import {
  coordonnéesCandidat,
  garantiesFinancières,
  identificationProjet,
  localisationProjet,
} from './colonnesParCatégorie'

describe(`Export des projets en tant qu'utilisateur "Caisse des dépôts"`, () => {
  beforeEach(resetDatabase)

  const colonnesÀExporter = [
    ...identificationProjet,
    ...coordonnéesCandidat,
    ...localisationProjet,
    ...garantiesFinancières,
  ].map((c) => (c.source === 'propriété-colonne-détail' ? c.nomPropriété : c.intitulé))

  it(`Étant donné des projets notifiés et non notifiés avec des détails
        Lorsqu'un utilisateur avec le rôle "caisse des dépôts exporte tous les projets
        Alors seuls les projets notifiés devrait être récupérés avec la liste des intitulés des colonnes exportées`, async () => {
    await models.Project.bulkCreate([
      makeFakeProject({
        notifiedOn: new Date('2021-07-31').getTime(),
        nomProjet: 'Projet Notifié Eolien',
      }),
      makeFakeProject({
        notifiedOn: 0,
        nomProjet: 'Projet Non Notifié Photovoltaïque',
      }),
      makeFakeProject({
        notifiedOn: new Date('2021-07-31').getTime(),
        nomProjet: 'Autre Notifié',
      }),
    ])

    const exportProjets = (await exporterProjets({ role: 'caisse-des-dépôts' }))._unsafeUnwrap()

    expect(exportProjets.colonnes).toEqual(colonnesÀExporter)

    expect(exportProjets.données).toHaveLength(2)
    expect(exportProjets.données).toEqual([
      expect.objectContaining({
        'Nom projet': 'Projet Notifié Eolien',
      }),
      expect.objectContaining({
        'Nom projet': 'Autre Notifié',
      }),
    ])
    expect(exportProjets.données).not.toContainEqual(
      expect.objectContaining({
        'Nom projet': 'Projet Non Notifié Photovoltaïque',
      })
    )
  })
})
