import models from '../../../models'
import { resetDatabase } from '../../../helpers'
import { onPeriodeCreated } from './onPeriodeCreated'
import { PeriodeCreated } from '@modules/appelOffre'
import { UniqueEntityID } from '@core/domain'

describe('appelOffre.onPeriodeCreated', () => {
  const { Periode } = models

  const appelOffreId = new UniqueEntityID().toString()
  const periodeId = new UniqueEntityID().toString()

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()
  })

  it('should create the appel offre', async () => {
    await onPeriodeCreated(models)(
      new PeriodeCreated({
        payload: {
          appelOffreId,
          periodeId,
          createdBy: '',
          data: {
            param1: 'value1',
            param2: 'value2',
          },
        },
      })
    )

    const createdPeriode = await Periode.findOne({ where: { appelOffreId, periodeId } })
    expect(createdPeriode).not.toBe(null)
    expect(createdPeriode.data).toEqual({
      param1: 'value1',
      param2: 'value2',
    })
  })
})
