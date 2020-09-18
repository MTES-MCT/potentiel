import { ResultAsync, ok, err, errAsync, okAsync } from '../../core/utils'
import { SendEmailProps, NotificationProps } from '../../modules/notification'
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

const TEMPLATE_ID_BY_TYPE: Record<NotificationProps['type'], number> = {
  designation: 1350523,
  'project-invitation': 1402576,
  'dreal-invitation': 1436254,
  'password-reset': 1389166,
  'pp-gf-notification': 1463065,
  'dreal-gf-notification': 1528696,
  'relance-designation': 1417004,
  'relance-gf': 1554449,
}

function sendEmailFromMailjet(props: SendEmailProps): ResultAsync<null, Error> {
  const {
    id,
    recipients,
    fromEmail,
    fromName,
    subject,
    type,
    variables,
  } = props

  const templateId = TEMPLATE_ID_BY_TYPE[type]

  if (!templateId) {
    return errAsync(new Error('Cannot find template for type ' + type))
  }

  const authorizedRecepients = recipients.filter(({ email }) =>
    isAuthorizedEmail(email)
  )

  if (!authorizedRecepients.length) return okAsync(null)

  return ResultAsync.fromPromise(
    mailjet.post('send', { version: 'v3.1' }).request({
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
    }),
    (err: any) => new Error(err.message)
  ).andThen((result: any) => {
    const sentMessage = result.body.Messages[0]
    if (sentMessage && sentMessage.Status === 'error') {
      return err(
        new Error(sentMessage.Errors.map((e) => e.ErrorMessage).join('; '))
      )
    }
    return ok(null)
  })
}

export { sendEmailFromMailjet }
