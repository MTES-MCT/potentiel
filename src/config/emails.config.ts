import { fakeSendEmail } from '../infra/mail/fakeEmailService'
import { makeSendEmailFromMailjet } from '../infra/mail/mailjet'

import { makeNotificationService, SendEmail } from '../modules/notification'
import { isProdEnv, isStagingEnv } from './env.config'
import { notificationRepo } from './repos.config'
import { getFailedNotifications } from './queries.config'

let sendEmail: SendEmail = fakeSendEmail

if (isProdEnv || isStagingEnv) {
  const { MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE, AUTHORIZED_TEST_EMAILS } = process.env
  const authorizedTestEmails = (AUTHORIZED_TEST_EMAILS && AUTHORIZED_TEST_EMAILS.split(',')) || []

  if (!MJ_APIKEY_PRIVATE || !MJ_APIKEY_PUBLIC) {
    console.error('Missing MJ_APIKEY_PRIVATE and/or MJ_APIKEY_PUBLIC env variables. Aborting.')
    process.exit(1)
  }

  try {
    sendEmail = makeSendEmailFromMailjet({
      MJ_APIKEY_PUBLIC,
      MJ_APIKEY_PRIVATE,
      authorizedTestEmails,
      isProduction: isProdEnv,
    })
    console.log('Emails will be sent through MAILJET')
    if (isStagingEnv) console.log('Outgoing emails will be restricted to:', authorizedTestEmails)
  } catch (e) {
    console.error('Unable to create mailjet sendEmail. Aborting.', e)
    process.exit(1)
  }
} else {
  console.log('Emails will go through a FAKE email service (no mails sent).')
}

if (!process.env.SEND_EMAILS_FROM) {
  console.log('ERROR: SEND_EMAILS_FROM is not set')
  process.exit(1)
}

export const { sendNotification, retryFailedNotifications } = makeNotificationService({
  sendEmail,
  emailSenderAddress: process.env.SEND_EMAILS_FROM,
  notificationRepo,
  getFailedNotifications,
})
