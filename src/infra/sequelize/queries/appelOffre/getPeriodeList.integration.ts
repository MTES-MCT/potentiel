import { UniqueEntityID } from '../../../../core/domain'
import { FileNotFoundError } from '@modules/file'
import { EntityNotFoundError } from '@modules/shared'
import { resetDatabase } from '../../helpers'
import models from '../../models'
import { getPeriodeList } from './getPeriodeList'

const { Periode } = models
describe('Sequelize getPeriodeListList', () => {
  const appelOffreId = new UniqueEntityID().toString()
  const periodeId = new UniqueEntityID().toString()

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()

    await Periode.bulkCreate([
      {
        appelOffreId,
        periodeId,
        data: { param1: 'value1' },
      },
    ])
  })

  it('should return a list of periodes', async () => {
    const res = await getPeriodeList()

    expect(res._unsafeUnwrap()).toMatchObject([
      {
        appelOffreId,
        periodeId,
        param1: 'value1',
      },
    ])
  })
})
