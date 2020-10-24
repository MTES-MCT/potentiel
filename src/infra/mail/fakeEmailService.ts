import { ResultAsync, okAsync } from '../../core/utils'
import { SendEmailProps } from '../../modules/notification'
/**
 *
 * This call sends a message to the given recipient with vars and custom vars.
 *
 */

const sentEmails: Array<SendEmailProps> = [] // For testing purposes only

function fakeSendEmail(props: SendEmailProps): ResultAsync<null, Error> {
  if (process.env.NODE_ENV === 'test') {
    // Register the sent email but don't send it for real
    sentEmails.push(props)
    return okAsync(null)
  }

  console.log(
    'EMAIL OUT: ' +
      props.recipients.map((item) => item.email).join(', ') +
      ' with subject "' +
      props.subject +
      '" and type ' +
      props.type
  )

  return okAsync(null)
}

// For tests only
const getSentEmails = () => {
  return sentEmails
}

const resetSentEmails = () => {
  while (sentEmails.length) {
    sentEmails.pop()
  }
}

export { getSentEmails, fakeSendEmail, resetSentEmails }
