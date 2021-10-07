import { UniqueEntityID } from '../../../../../core/domain'
import { UserRegistered } from '../../../../../modules/users'
import { describeProjector } from '../../../__tests__/projections'
import models from '../../../models'
import { onUserRegistered } from './onUserRegistered'

const { User } = models

const userId = new UniqueEntityID().toString()

describeProjector(onUserRegistered)
  .onEvent(
    new UserRegistered({
      payload: {
        userId,
        fullName: 'John Doe',
      },
      original: {
        version: 1,
        occurredAt: new Date(123),
      },
    })
  )
  .shouldUpdate({
    model: User,
    id: userId,
    before: {
      id: userId,
      fullName: '',
      email: 'test@test.test',
      role: 'porteur-projet',
      registeredOn: null,
    },
    after: {
      id: userId,
      fullName: 'John Doe',
      email: 'test@test.test',
      role: 'porteur-projet',
      registeredOn: new Date(123),
    },
  })
