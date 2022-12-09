import models from '../../../models'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { onDonnéesDeRaccordementRenseignées } from './onDonnéesDeRaccordementRenseignées'
import { DonnéesDeRaccordementRenseignées } from '@modules/project'
import { UniqueEntityID } from '@core/domain'

describe(`Mise à jour du projet suite à l'ajout d'une date de mise en service`, () => {
  const { Project } = models

  it(`Étant donné un projet
      Lorsqu'une date de mise en service est renseignée
      Alors le projet devrait avoir cette date comme dateMiseEnService`, async () => {
    const projetId = new UniqueEntityID().toString()
    const dateMiseEnService = new Date('2022-01-01')
    const dateFileAttente = new Date('2023-01-01')

    await Project.create(makeFakeProject({ id: projetId, dateMiseEnService: undefined }))

    await onDonnéesDeRaccordementRenseignées(models)(
      new DonnéesDeRaccordementRenseignées({
        payload: {
          projetId,
          dateMiseEnService,
          dateFileAttente,
        },
      })
    )
    const projetActuel = await Project.findByPk(projetId)
    expect(projetActuel.dateMiseEnService).toEqual(dateMiseEnService.toISOString())
    expect(projetActuel.dateFileAttente).toEqual(dateFileAttente)
  })
})
