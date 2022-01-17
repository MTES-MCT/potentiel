import { ResultAsync } from '@core/utils'
import { NotificationProps } from './Notification'

export type SendEmailProps = {
  id: string
  fromEmail: string
  fromName: string
  subject?: string
  type: NotificationProps['type']
  variables: Record<string, string>
  recipients: Array<{ email: string; name?: string }>
}

export type SendEmail = (email: SendEmailProps) => ResultAsync<null, Error>
