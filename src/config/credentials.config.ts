import { UniqueEntityID } from '../core/domain'
import { logger, okAsync } from '../core/utils'
import {
  createUserCredentials as kcCreateUserCredentials,
  getUserName as kcGetUserName,
  resendInvitationEmail as kcResendInvitationEmail,
} from '../infra/keycloak'
import { CreateUserCredentials, GetUserName } from '../modules/users'
import { ResendInvitationEmail } from '../modules/users/queries/ResendInvitationEmail'
import { isProdEnv, isStagingEnv } from './env.config'

let getUserName: GetUserName
let createUserCredentials: CreateUserCredentials
let resendInvitationEmail: ResendInvitationEmail

if (isProdEnv || isStagingEnv) {
  createUserCredentials = kcCreateUserCredentials
  getUserName = kcGetUserName
  resendInvitationEmail = kcResendInvitationEmail
} else {
  getUserName = (id) => okAsync('Utilisateur Test')
  createUserCredentials = () => okAsync(new UniqueEntityID().toString())
  resendInvitationEmail = (email) => {
    logger.info(`Fake resend invitation email to ${email}`)
    return okAsync(null)
  }
}

export { getUserName, createUserCredentials, resendInvitationEmail }
