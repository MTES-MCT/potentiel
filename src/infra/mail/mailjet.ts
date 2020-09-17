import { ResultAsync, Ok, ErrorResult } from '../../types'
import { EmailProps } from '../../useCases/sendNotification'
/**
 *
 * This call sends a message to the given recipient with vars and custom vars.
 *
 */

const mailjet = require('node-mailjet').connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
)

const AUTHORIZED_TEST_EMAILS =
  process.env.AUTHORIZED_TEST_EMAILS &&
  process.env.AUTHORIZED_TEST_EMAILS.split(',')

console.log('AUTHORIZED TEST EMAILS ARE', AUTHORIZED_TEST_EMAILS)
console.log('BASE URL IS', process.env.BASE_URL)

function isAuthorizedEmail(destinationEmail: string): boolean {
  // If it is not production environment
  // Only authorize sending emails to emails listed in the AUTHORIZED_TEST_EMAILS environment var
  if (
    process.env.NODE_ENV !== 'production' &&
    !AUTHORIZED_TEST_EMAILS?.includes(destinationEmail)
  ) {
    console.log(
      'sendEmailNotification called outside of production environment on an unknown destinationEmail, message stopped.',
      destinationEmail
    )
    return false
  }

  return true
}

async function sendEmailFromMailjet(props: EmailProps): ResultAsync<null> {
  const {
    id,
    recipients,
    fromEmail,
    fromName,
    subject,
    templateId,
    variables,
  } = props

  const authorizedRecepients = recipients.filter(({ email }) =>
    isAuthorizedEmail(email)
  )

  if (!authorizedRecepients.length) return Ok(null)

  try {
    const result = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: fromEmail,
            Name: fromName,
          },
          To: authorizedRecepients.map(({ email, name }) => ({
            Email: email,
            Name: name,
          })),
          TemplateID: templateId,
          TemplateLanguage: true,
          Subject: subject,
          Variables: variables,
          CustomId: id,
        },
      ],
    })

    const sentMessage = result.body.Messages[0]
    if (sentMessage && sentMessage.Status === 'error') {
      return ErrorResult(
        sentMessage.Errors.map((e) => e.ErrorMessage).join('; ')
      )
    }

    return Ok(null)
  } catch (error) {
    return ErrorResult(error.message)
  }
}

export { sendEmailFromMailjet }
