import { resetDatabase } from '@infra/sequelize/helpers'
import { User } from '@entities'
import { getPtfDTO } from './getPtfDTO'
import { makeDocumentUrl } from '../../../../views/components/timeline/helpers/makeDocumentUrl'

describe(`Requête getPtfDTO`, () => {
  const utilisateur = { role: 'porteur-projet' } as User

  beforeEach(async () => await resetDatabase())

  it(`Etant donné un projet éliminé avec une PTF
      alors la requête devrait retourner undefined`, async () => {
    const résultat = await getPtfDTO({
      ptf: {
        ptfDateDeSignature: new Date(),
        ptfFichier: { filename: 'ptf-filename', id: 'file-id' },
      },
      user: utilisateur,
      projetStatus: 'Eliminé',
    })

    expect(résultat).toBeUndefined()
  })

  it(`Etant donné un projet abandonné avec une PTF
      alors la requête devrait retourner undefined`, async () => {
    const résultat = await getPtfDTO({
      ptf: {
        ptfDateDeSignature: new Date(),
        ptfFichier: { filename: 'ptf-filename', id: 'file-id' },
      },
      user: utilisateur,
      projetStatus: 'Abandonné',
    })

    expect(résultat).toBeUndefined()
  })

  it(`Etant donné un projet classé sans PTF
      alors la requête devrait retourner un PtfDTO avec statut 'not-submitted'`, async () => {
    const résultat = await getPtfDTO({
      ptf: {
        ptfDateDeSignature: null,
        ptfFichier: null,
      },
      user: utilisateur,
      projetStatus: 'Classé',
    })

    expect(résultat).toMatchObject({
      type: 'proposition-technique-et-financiere',
      status: 'not-submitted',
      role: utilisateur.role,
    })
  })

  it(`Etant donné un projet classé avec une PTF
      alors la requête devrait retourner un PtfDTO avec statut 'submitted'`, async () => {
    const ptf = {
      ptfDateDeSignature: new Date(),
      ptfFichier: { filename: 'ptf-filename', id: 'file-id' },
    } as const

    const résultat = await getPtfDTO({
      ptf: ptf,
      user: utilisateur,
      projetStatus: 'Classé',
    })

    expect(résultat).toMatchObject({
      type: 'proposition-technique-et-financiere',
      status: 'submitted',
      role: utilisateur.role,
      date: ptf.ptfDateDeSignature.getTime(),
      url: makeDocumentUrl(ptf.ptfFichier.id, ptf.ptfFichier.filename),
    })
  })
})
