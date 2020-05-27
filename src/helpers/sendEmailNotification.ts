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

const sentEmails: any = [] // For testing purposes only

const sendEmailNotification = async ({
  destinationEmail,
  destinationName,
  subject,
  invitationLink,
}: EmailNotificationProps) => {
  if (process.env.NODE_ENV === 'test') {
    // Register the sent email but don't send it for real
    sentEmails.push({
      destinationEmail,
      destinationName,
      subject,
      invitationLink,
    })
    return
  }

  if (!isAuthorizedEmail(destinationEmail)) {
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

const sendPasswordResetEmail = async (
  destinationEmail: string,
  resetLink: string
) => {
  if (process.env.NODE_ENV === 'test') {
    // Register the sent email but don't send it for real
    sentEmails.push({
      destinationEmail,
      resetLink,
    })
    return
  }

  if (!isAuthorizedEmail(destinationEmail)) {
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
            },
          ],
          TemplateID: 1389166,
          TemplateLanguage: true,
          Subject: 'Récupération de mot de passe Potentiel',
          Variables: {
            password_reset_link: process.env.BASE_URL + resetLink,
          },
        },
      ],
    })
    console.log(
      "Envoi d'un mail de récupération de mot de passe à ",
      destinationEmail
    )
  } catch (error) {
    console.log('sendEmailNotification received an error', error)
  }
}

interface ProjectInvitationProps {
  destinationEmail: string
  subject: string
  invitationLink: string
  nomProjet: string
}

const sendProjectInvitation = async ({
  destinationEmail,
  subject,
  invitationLink,
  nomProjet,
}: ProjectInvitationProps) => {
  if (process.env.NODE_ENV === 'test') {
    // Register the sent email but don't send it for real
    sentEmails.push({
      destinationEmail,
      subject,
      invitationLink,
      nomProjet,
    })
    return
  }

  if (!isAuthorizedEmail(destinationEmail)) {
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
            },
          ],
          TemplateID: 1402576,
          TemplateLanguage: true,
          Subject: subject,
          Variables: {
            invitation_link: process.env.BASE_URL + invitationLink,
            nomProjet,
          },
        },
      ],
    })
  } catch (error) {
    console.log('sendProjectInvitation received an error', error)
  }
}

interface DrealInvitationProps {
  destinationEmail: string
  subject: string
  invitationLink: string
}

const sendDrealInvitation = async ({
  destinationEmail,
  subject,
  invitationLink,
}: DrealInvitationProps) => {
  if (process.env.NODE_ENV === 'test') {
    // Register the sent email but don't send it for real
    sentEmails.push({
      destinationEmail,
      subject,
      invitationLink,
    })
    return
  }

  if (!isAuthorizedEmail(destinationEmail)) {
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
            },
          ],
          TemplateID: 1436254,
          TemplateLanguage: true,
          Subject: subject,
          Variables: {
            invitation_link: process.env.BASE_URL + invitationLink,
          },
        },
      ],
    })
  } catch (error) {
    console.log('sendDrealInvitation received an error', error)
  }
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

export {
  sendEmailNotification,
  sendPasswordResetEmail,
  sendProjectInvitation,
  sendDrealInvitation,
  getSentEmails,
  resetSentEmails,
}
