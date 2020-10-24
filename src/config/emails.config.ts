import { fakeSendEmail } from '../infra/mail/fakeEmailService'
import { sendEmailFromMailjet } from '../infra/mail/mailjet'

import { makeNotificationService, SendEmail } from '../modules/notification'
import { isProdEnv, isStagingEnv } from './env.config'
import { notificationRepo } from './repos.config'
import { getFailedNotifications } from './queries.config'

const sendEmail: SendEmail = isProdEnv || isStagingEnv ? sendEmailFromMailjet : fakeSendEmail

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
