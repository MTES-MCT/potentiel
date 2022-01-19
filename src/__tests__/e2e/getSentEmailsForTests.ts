import { getSentEmails } from '@infra/mail'
import { testRouter } from './testRouter'

testRouter.get('/test/getSentEmails', async (request, response) => {
  return response.send({ emails: getSentEmails() })
})
