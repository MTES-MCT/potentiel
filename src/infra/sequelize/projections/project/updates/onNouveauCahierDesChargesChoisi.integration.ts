import models from '../../../models'
import { resetDatabase } from '../../../helpers'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { onNouveauCahierDesChargesChoisi } from './onNouveauCahierDesChargesChoisi'
import { NouveauCahierDesChargesChoisi } from '@modules/project'
import { UniqueEntityID } from '@core/domain'

describe('Mise à jour du projet suite au choix du nouveau cahier des charges', () => {
  const { Project } = models

  beforeAll(async () => {
    await resetDatabase()
  })

  const fixtures = [
    {
      cahierDesChargesActuel: 'initial',
      cahierDesChargesChoisi: { paruLe: '30/07/2021' },
      cahierDesChargesAttendu: '30/07/2021',
    },
    {
      cahierDesChargesActuel: 'initial',
      cahierDesChargesChoisi: { paruLe: '30/08/2022' },
      cahierDesChargesAttendu: '30/08/2022',
    },
    {
      cahierDesChargesActuel: 'initial',
      cahierDesChargesChoisi: { paruLe: '30/08/2022', alternatif: true },
      cahierDesChargesAttendu: '30/08/2022-alternatif',
    },
  ]

  for (const {
    cahierDesChargesActuel,
    cahierDesChargesChoisi,
    cahierDesChargesAttendu,
  } of fixtures) {
    it(`Étant donné un projet avec l'ancien cahier des charges
      Lorsque le nouveau cahier des charges est choisi
      Alors le projet devrait être soumis aux nouvelles règles d'instruction`, async () => {
      const projetId = new UniqueEntityID().toString()
      await Project.create(makeFakeProject({ id: projetId, cahierDesChargesActuel }))

      await onNouveauCahierDesChargesChoisi(models)(
        new NouveauCahierDesChargesChoisi({
          payload: {
            projetId: projetId,
            choisiPar: 'porteur de projet',
            ...cahierDesChargesChoisi,
          } as NouveauCahierDesChargesChoisi['payload'],
        })
      )

      const projetActuel = await Project.findByPk(projetId)
      expect(projetActuel.cahierDesChargesActuel).toEqual(cahierDesChargesAttendu)
    })
  }
})
