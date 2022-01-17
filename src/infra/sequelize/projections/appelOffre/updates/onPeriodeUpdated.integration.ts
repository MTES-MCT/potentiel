import models from '../../../models'
import { resetDatabase } from '../../../helpers'
import { onPeriodeUpdated } from './onPeriodeUpdated'
import { PeriodeUpdated } from '@modules/appelOffre'
import { UniqueEntityID } from '../../../../../core/domain'

describe('appelOffre.onPeriodeUpdated', () => {
  const { Periode } = models

  const appelOffreId = new UniqueEntityID().toString()
  const periodeId = new UniqueEntityID().toString()

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()

    await Periode.create({
      periodeId,
      appelOffreId,
      data: { param2: 'value2', param3: 'value3' },
    })
  })

  it('should update the periode data with the delta', async () => {
    await onPeriodeUpdated(models)(
      new PeriodeUpdated({
        payload: {
          appelOffreId,
          periodeId,
          updatedBy: '',
          delta: {
            param1: 'value1',
            param2: 'newvalue2',
          },
        },
      })
    )

    const updatedPeriode = await Periode.findOne({ where: { appelOffreId, periodeId } })
    expect(updatedPeriode.data).toEqual({
      param1: 'value1',
      param2: 'newvalue2',
      param3: 'value3',
    })
  })
})
