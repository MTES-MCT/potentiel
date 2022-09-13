import models from '../../../models'
import { resetDatabase } from '../../../helpers'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { onNouveauCahierDesChargesChoisi } from './onNouveauCahierDesChargesChoisi'
import { NouveauCahierDesChargesChoisi } from '@modules/project'

describe('Mise à jour du projet suite au choix du nouveau cahier des charges', () => {
  const { Project } = models

  beforeAll(async () => {
    await resetDatabase()
  })

  it(`Étant donné un projet avec l'ancien cahier des charges
      Lorsque le nouveau cahier des charges est choisi
      Alors le projet devrait être soumis aux nouvelles règles d'instruction`, async () => {
    const projetId = 'le-projet'
    await Project.create(makeFakeProject({ id: projetId, newRulesOptIn: false }))

    await onNouveauCahierDesChargesChoisi(models)(
      new NouveauCahierDesChargesChoisi({
        payload: {
          projetId: projetId,
          choisiPar: 'porteur de projet',
          paruLe: '30/07/2021',
        },
      })
    )

    const projetActuel = await Project.findByPk(projetId)
    expect(projetActuel.newRulesOptIn).toEqual(true)
  })
})
