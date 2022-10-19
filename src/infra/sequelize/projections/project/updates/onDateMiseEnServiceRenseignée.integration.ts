import models from '../../../models'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { onDateMiseEnServiceRenseignée } from './onDateMiseEnServiceRenseignée'
import { DateMiseEnServiceRenseignée } from '@modules/project'
import { UniqueEntityID } from '@core/domain'

describe(`Mise à jour du projet suite à l'ajout d'une date de mise en service`, () => {
  const { Project } = models

  it(`Étant donné un projet
      Lorsqu'une date de mise en service est renseignée
      Alors le projet devrait avoir cette date comme dateMiseEnService`, async () => {
    const projetId = new UniqueEntityID().toString()
    const dateMiseEnService = new Date('2022-01-01').toISOString()

    await Project.create(makeFakeProject({ id: projetId, dateMiseEnService: undefined }))

    await onDateMiseEnServiceRenseignée(models)(
      new DateMiseEnServiceRenseignée({
        payload: {
          projetId,
          dateMiseEnService,
        } as DateMiseEnServiceRenseignée['payload'],
      })
    )

    const projetActuel = await Project.findByPk(projetId)
    expect(projetActuel.dateMiseEnService).toEqual(dateMiseEnService)
  })
})
