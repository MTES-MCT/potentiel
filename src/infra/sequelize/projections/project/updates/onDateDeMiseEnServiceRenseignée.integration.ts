import models from '../../../models'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { onDateDeMiseEnServiceRenseignée } from './onDateDeMiseEnServiceRenseignée'
import { DateDeMiseEnServiceRenseignée } from '@modules/project'
import { UniqueEntityID } from '@core/domain'

describe(`Mise à jour du projet suite à l'ajout d'une date de mise en service`, () => {
  const { Project } = models

  it(`Étant donné un projet
      Lorsqu'une date de mise en service est renseignée
      Alors le projet devrait avoir cette date comme dateDeMiseEnService`, async () => {
    const projetId = new UniqueEntityID().toString()
    const dateDeMiseEnService = new Date('2022-01-01').toISOString()

    await Project.create(makeFakeProject({ id: projetId, dateDeMiseEnService: undefined }))

    await onDateDeMiseEnServiceRenseignée(models)(
      new DateDeMiseEnServiceRenseignée({
        payload: {
          projetId,
          dateDeMiseEnService,
        } as DateDeMiseEnServiceRenseignée['payload'],
      })
    )

    const projetActuel = await Project.findByPk(projetId)
    expect(projetActuel.dateDeMiseEnService).toEqual(dateDeMiseEnService)
  })
})
