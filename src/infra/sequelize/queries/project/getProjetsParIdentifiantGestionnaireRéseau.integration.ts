import models from '../../models'
import { resetDatabase } from '../../helpers'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import { getProjetsParIdentifiantGestionnaireRéseau } from './getProjetsParIdentifiantGestionnaireRéseau'
import { UniqueEntityID } from '@core/domain'

const ProjectModel = models.Project

describe('Trouver les identifiants des projets depuis leur identifiant de gestionnaire de réseau', () => {
  beforeEach(async () => {
    await resetDatabase()
  })

  const fixtures = [
    {
      identifiantsGR: 'OUE-RP-2022-000137',
      projet: makeFakeProject({
        id: new UniqueEntityID().toString(),
        numeroGestionnaire: 'OUE-RP-2022-000137',
      }),
    },
    {
      identifiantsGR: 'OUE-RP-2022-000137',
      projet: makeFakeProject({
        id: new UniqueEntityID().toString(),
        numeroGestionnaire: 'Enedis OUE-RP-2022-000137',
      }),
    },
    {
      identifiantsGR: 'OUE-RP-2022-000137',
      projet: makeFakeProject({
        id: new UniqueEntityID().toString(),
        numeroGestionnaire: 'oue-rp-2022-000137',
      }),
    },
  ]

  for (const { identifiantsGR, projet } of fixtures) {
    it(`Étant donné un projet avec l'identifiant gestionnaire de réseau "${projet.numeroGestionnaire}"
        Lorsqu'on récupère les projets pour l'identifiant gestionnaire de réseau ${identifiantsGR}
        Alors l'id du dit projet devrait être récupéré pour l'identifiant gestionnaire de réseau ${identifiantsGR}`, async () => {
      await ProjectModel.bulkCreate([makeFakeProject(projet)])

      const résultat = await getProjetsParIdentifiantGestionnaireRéseau([identifiantsGR])

      expect(résultat._unsafeUnwrap()).toStrictEqual({
        [identifiantsGR]: expect.arrayContaining([{ id: projet.id }]),
      })
    })
  }

  it(`Étant donné plusieurs projets avec l'identifiant gestionnaire de réseau 'OUE-RP-2022-000137' 
      Et aucun pour 'Autre-Numéro'
      Lorsqu'on récupère les projets pour les identifiants gestionnaire de réseau 'OUE-RP-2022-000137' et 'Autre-Numéro'
      Alors l'id des projets devraient être récupérés pour 'OUE-RP-2022-000137'
      Et aucun id ne devraient être récupéré pour 'Autre-Numéro'`, async () => {
    const projet1Id = new UniqueEntityID().toString()
    const projet2Id = new UniqueEntityID().toString()
    const projet3Id = new UniqueEntityID().toString()

    await ProjectModel.bulkCreate([
      makeFakeProject({ id: projet1Id, numeroGestionnaire: 'OUE-RP-2022-000137' }),
      makeFakeProject({ id: projet2Id, numeroGestionnaire: 'Enedis OUE-RP-2022-000137' }),
      makeFakeProject({ id: projet3Id, numeroGestionnaire: 'oue-rp-2022-000137' }),
    ])

    const résultat = await getProjetsParIdentifiantGestionnaireRéseau([
      'OUE-RP-2022-000137',
      'Autre-Numéro',
    ])

    expect(résultat._unsafeUnwrap()).toMatchObject({
      'OUE-RP-2022-000137': expect.arrayContaining([
        { id: projet2Id },
        { id: projet3Id },
        { id: projet1Id },
      ]),
      'Autre-Numéro': [],
    })
  })
})
