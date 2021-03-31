import models from '../../../models'
import { resetDatabase } from '../../../helpers'
import { onAppelOffreUpdated } from './onAppelOffreUpdated'
import { AppelOffreUpdated } from '../../../../../modules/appelOffre/events'
import { UniqueEntityID } from '../../../../../core/domain'

describe('appelOffre.onAppelOffreUpdated', () => {
  const { AppelOffre } = models

  const appelOffreId = new UniqueEntityID().toString()

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()

    await AppelOffre.create({
      id: appelOffreId,
      data: { param2: 'value2', param3: 'value3' },
    })
  })

  it('should update the appel offre data with the delta', async () => {
    await onAppelOffreUpdated(models)(
      new AppelOffreUpdated({
        payload: {
          appelOffreId,
          updatedBy: '',
          delta: {
            param1: 'value1',
            param2: 'newvalue2',
          },
        },
      })
    )

    const updatedAppelOffre = await AppelOffre.findByPk(appelOffreId)
    expect(updatedAppelOffre.data).toEqual({
      param1: 'value1',
      param2: 'newvalue2',
      param3: 'value3',
    })
  })
})
