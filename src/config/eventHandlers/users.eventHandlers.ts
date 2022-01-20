import { LegacyCandidateNotified } from '@modules/legacyCandidateNotification'
import { handleLegacyCandidateNotified } from '@modules/users'
import { eventStore } from '../eventStore.config'
import { createUser } from '../useCases.config'

eventStore.subscribe(LegacyCandidateNotified.type, handleLegacyCandidateNotified({ createUser }))

console.log('Users Event Handlers Initialized')
export const UsersHandlersOk = true
