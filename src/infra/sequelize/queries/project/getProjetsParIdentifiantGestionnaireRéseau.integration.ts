import { Raccordements } from '../../projectionsNext/raccordements'
import { resetDatabase } from '../../helpers'
import { getProjetsParIdentifiantGestionnaireRéseau } from './getProjetsParIdentifiantGestionnaireRéseau'
import { UniqueEntityID } from '@core/domain'
import * as uuid from 'uuid'

describe('Trouver les identifiants des projets depuis leur identifiant de gestionnaire de réseau', () => {
  beforeEach(async () => {
    await resetDatabase()
  })

  const fixtures: Array<{ identifiantsGR: string; raccordements: Raccordements }> = [
    {
      identifiantsGR: 'OUE-RP-2022-000137',
      raccordements: {
        id: new UniqueEntityID().toString(),
        projetId: new UniqueEntityID().toString(),
        identifiantGestionnaire: 'OUE-RP-2022-000137',
      } as Raccordements,
    },
    {
      identifiantsGR: 'OUE-RP-2022-000137',
      raccordements: {
        id: new UniqueEntityID().toString(),
        projetId: new UniqueEntityID().toString(),
        identifiantGestionnaire: 'Enedis OUE-RP-2022-000137',
      } as Raccordements,
    },
    {
      identifiantsGR: 'OUE-RP-2022-000137',
      raccordements: {
        id: new UniqueEntityID().toString(),
        projetId: new UniqueEntityID().toString(),
        identifiantGestionnaire: 'oue-rp-2022-000137',
      } as Raccordements,
    },
  ]

  for (const {
    identifiantsGR,
    raccordements: { id, projetId, identifiantGestionnaire },
  } of fixtures) {
    it(`Étant donné un projet avec l'identifiant gestionnaire de réseau "${identifiantGestionnaire}"
        Lorsqu'on récupère les projets pour l'identifiant gestionnaire de réseau ${identifiantsGR}
        Alors l'id du dit projet devrait être récupéré pour l'identifiant gestionnaire de réseau ${identifiantsGR}`, async () => {
      await Raccordements.create({
        id,
        projetId,
        identifiantGestionnaire,
      })

      const résultat = await getProjetsParIdentifiantGestionnaireRéseau([identifiantsGR])
      expect(résultat.isOk()).toBe(true)
      expect(résultat._unsafeUnwrap()).toStrictEqual({
        [identifiantsGR]: expect.arrayContaining([{ projetId }]),
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

    await Raccordements.bulkCreate([
      { id: uuid.v4(), projetId: projet1Id, identifiantGestionnaire: 'OUE-RP-2022-000137' },
      { id: uuid.v4(), projetId: projet2Id, identifiantGestionnaire: 'Enedis OUE-RP-2022-000137' },
      { id: uuid.v4(), projetId: projet3Id, identifiantGestionnaire: 'oue-rp-2022-000137' },
    ])

    const résultat = await getProjetsParIdentifiantGestionnaireRéseau([
      'OUE-RP-2022-000137',
      'Autre-Numéro',
    ])
    expect(résultat.isOk()).toBe(true)
    expect(résultat._unsafeUnwrap()).toMatchObject({
      'OUE-RP-2022-000137': expect.arrayContaining([
        { projetId: projet2Id },
        { projetId: projet3Id },
        { projetId: projet1Id },
      ]),
      'Autre-Numéro': [],
    })
  })
})
