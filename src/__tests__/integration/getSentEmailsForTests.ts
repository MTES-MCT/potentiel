import { Success } from '../../helpers/responses'
import { HttpRequest } from '../../types'
import { getSentEmails } from '../../infra/mail/fakeEmailService'

const getSentEmailsForTests = async (request: HttpRequest) => {
  return Success({ emails: getSentEmails() })
}

export { getSentEmailsForTests }
