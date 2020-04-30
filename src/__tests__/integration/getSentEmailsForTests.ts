import { projectRepo, userRepo } from '../../dataAccess'
import { User, makeProject } from '../../entities'
import { Success, SystemError } from '../../helpers/responses'
import { HttpRequest } from '../../types'
import makeFakeProject from '../fixtures/project'
import { getSentEmails } from '../../helpers/sendEmailNotification'

const getSentEmailsForTests = async (request: HttpRequest) => {
  return Success({ emails: getSentEmails() })
}

export { getSentEmailsForTests }
