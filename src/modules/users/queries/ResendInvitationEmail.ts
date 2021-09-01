import { ResultAsync } from '../../../core/utils'
import { OtherError } from '../../shared'

export interface ResendInvitationEmail {
  (email: string): ResultAsync<null, OtherError>
}
