import { UniqueEntityID } from '../../../../core/domain'
import { resetDatabase } from '../../helpers'
import models from '../../models'
import { getAppelOffreList } from './getAppelOffreList'

describe('Sequelize getAppelOffreListList', () => {
  const { AppelOffre } = models

  const appelOffreId = new UniqueEntityID().toString()

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()

    await AppelOffre.bulkCreate([
      {
        id: appelOffreId,
        data: { param1: 'value1' },
      },
    ])
  })

  it('should return a list of appel offre', async () => {
    const res = await getAppelOffreList()

    expect(res._unsafeUnwrap()).toMatchObject([
      {
        appelOffreId,
        param1: 'value1',
      },
    ])
  })
})
