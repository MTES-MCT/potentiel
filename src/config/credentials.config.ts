import { UniqueEntityID } from '@core/domain'
import { logger, okAsync } from '@core/utils'
import {
  createUserCredentials as kcCreateUserCredentials,
  getUserName as kcGetUserName,
  resendInvitationEmail as kcResendInvitationEmail,
} from '../infra/keycloak'
import { GetUserName, ResendInvitationEmail } from '@modules/users'
import { CreateUserCredentials } from '@modules/authN'
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
  createUserCredentials = (args) => {
    logger.info(`FAKE createUserCredentials(${JSON.stringify(args)})`)
    return okAsync(null)
  }
  resendInvitationEmail = (email) => {
    logger.info(`FAKE resend invitation email to ${email}`)
    return okAsync(null)
  }
}

export { getUserName, createUserCredentials, resendInvitationEmail }
