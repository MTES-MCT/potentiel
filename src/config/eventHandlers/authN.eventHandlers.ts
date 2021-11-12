import { handleUserCreated } from '../../modules/authN'
import { UserCreated } from '../../modules/users'
import { createUserCredentials } from '../credentials.config'
import { eventStore } from '../eventStore.config'

eventStore.subscribe(
  UserCreated.type,
  handleUserCreated({
    createUserCredentials,
  })
)

console.log('AuthN Event Handlers Initialized')
export const authNHandlersOk = true
