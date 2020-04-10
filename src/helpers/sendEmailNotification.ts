/**
 *
 * This call sends a message to the given recipient with vars and custom vars.
 *
 */

const mailjet = require('node-mailjet').connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
)

interface EmailNotificationProps {
  destinationEmail: string
  destinationName: string
  subject: string
  invitationLink: string
}

const AUTHORIZED_TEST_EMAILS =
  process.env.AUTHORIZED_TEST_EMAILS &&
  process.env.AUTHORIZED_TEST_EMAILS.split(',')

console.log('AUTHORIZED TEST EMAILS ARE', AUTHORIZED_TEST_EMAILS)
console.log('BASE URL IS', process.env.BASE_URL)

const sendEmailNotification = async ({
  destinationEmail,
  destinationName,
  subject,
  invitationLink,
}: EmailNotificationProps) => {
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
    return
  }

  if (!process.env.BASE_URL) {
    console.log('Missing process.env.BASE_URL, aborting')
    return
  }

  try {
    await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.SEND_EMAILS_FROM,
            Name: 'Cellule PV',
          },
          To: [
            {
              Email: destinationEmail,
              Name: destinationName,
            },
          ],
          TemplateID: 1350523,
          TemplateLanguage: true,
          Subject: subject,
          Variables: {
            invitation_link: process.env.BASE_URL + invitationLink,
          },
        },
      ],
    })
  } catch (error) {
    console.log('sendEmailNotification received an error', error)
  }
}

export { sendEmailNotification }
