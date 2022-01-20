import { UniqueEntityID } from '@core/domain'
import { describeProjector } from '../../../__tests__/projections'
import models from '../../../models'
import { onDrealUserInvited } from './onDrealUserInvited'
import { DrealUserInvited } from '@modules/authZ'
import { resetDatabase } from '../../../helpers'

const { UserDreal } = models

const userId = new UniqueEntityID().toString()
describe('userDreal.onDrealUserInvited', () => {
  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase()

    await onDrealUserInvited(
      new DrealUserInvited({
        payload: {
          userId,
          region: 'Bretagne',
          invitedBy: '',
        },
      })
    )
  })

  it('should create the user dreal link', async () => {
    const result = await UserDreal.findOne({ where: { userId, dreal: 'Bretagne' } })
    expect(result).not.toEqual(null)
  })
})
