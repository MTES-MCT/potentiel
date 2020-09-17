import { ResultAsync, Ok, ErrorResult } from '../../types'
import { EmailProps } from '../../useCases/sendNotification'
/**
 *
 * This call sends a message to the given recipient with vars and custom vars.
 *
 */

const sentEmails: Array<EmailProps> = [] // For testing purposes only

async function fakeSendEmail(props: EmailProps): ResultAsync<null> {
  if (process.env.NODE_ENV === 'test') {
    // Register the sent email but don't send it for real
    sentEmails.push(props)
    return Ok(null)
  }

  console.log(
    'EMAIL OUT: ' +
      props.recipients.map((item) => item.email).join(', ') +
      ' with subject "' +
      props.subject +
      '" and templateId ' +
      props.templateId
  )

  return Ok(null)
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
