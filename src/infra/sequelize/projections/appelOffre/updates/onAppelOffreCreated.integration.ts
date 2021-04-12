import models from '../../../models'
import { resetDatabase } from '../../../helpers'
import { onAppelOffreCreated } from './onAppelOffreCreated'
import { AppelOffreCreated } from '../../../../../modules/appelOffre/events'
import { UniqueEntityID } from '../../../../../core/domain'

describe('appelOffre.onAppelOffreCreated', () => {
  const { AppelOffre } = models

  const appelOffreId = new UniqueEntityID().toString()

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()
  })

  it('should create the appel offre', async () => {
    await onAppelOffreCreated(models)(
      new AppelOffreCreated({
        payload: {
          appelOffreId,
          createdBy: '',
          data: {
            param1: 'value1',
            param2: 'value2',
          },
        },
      })
    )

    const createdAppelOffre = await AppelOffre.findByPk(appelOffreId)
    expect(createdAppelOffre).not.toBe(null)
    expect(createdAppelOffre.data).toEqual({
      param1: 'value1',
      param2: 'value2',
    })
  })
})
