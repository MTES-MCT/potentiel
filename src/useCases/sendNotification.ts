import { Notification, NotificationProps, makeNotification } from '../entities'
import ROUTES from '../routes'
import { NotificationRepo } from '../dataAccess'
import _ from 'lodash'
import { ResultAsync } from '../types'
import { Omit } from 'utility-types'

export type EmailProps = {
  id: string
  fromEmail: string
  fromName: string
  subject: string
  templateId: number
  variables: Record<string, string>
  recipients: Array<{ email: string; name?: string }>
}

interface MakeUseCaseProps {
  notificationRepo: NotificationRepo
  sendEmail: (email: EmailProps) => ResultAsync<void>
}

type CallUseCaseProps = NotificationProps

const TEMPLATE_ID_BY_TYPE: Record<Notification['type'], number> = {
  designation: 1350523,
  'project-invitation': 1402576,
  'dreal-invitation': 1436254,
  'password-reset': 1389166,
}

/**
 * This use-case sends notifications using the email service and persists messages in the NotificationRepo
 * It is designed as a dead-end and never fails (never returns an error to the caller)
 * Even if the email service is out, the notification is persisted (with an error)
 * That's enough information for an admin to re-emit the notification if necessary
 */

export default function makeSendNotification({
  notificationRepo,
  sendEmail,
}: MakeUseCaseProps) {
  return async function sendNotification(
    props: CallUseCaseProps
  ): Promise<void> {
    const notification = makeNotification({ ...props, status: 'sent' })

    if (!process.env.SEND_EMAILS_FROM) {
      console.log(
        'Cannot send emails if SEND_EMAILS_FROM environment var is not set'
      )

      notification.status = 'error'
      notification.error = 'Missing SEND_EMAILS_FROM environment variable'
      await notificationRepo.save(notification)
      return
    }

    const {
      id,
      message: { subject, name, email },
      type,
      variables,
    } = notification

    const res = await sendEmail({
      id,
      fromEmail: process.env.SEND_EMAILS_FROM,
      fromName: 'Cellule PV',
      subject,
      templateId: TEMPLATE_ID_BY_TYPE[type],
      variables,
      recipients: [{ email, name }],
    })

    if (res.is_err()) {
      console.log(
        'sendNotification use-case failed when calling sendEmail',
        res.unwrap_err()
      )
      notification.status = 'error'
      notification.error = res.unwrap_err().message
    }

    await notificationRepo.save(notification)
  }
}
