// Create a fake email service
import { EmailProps } from '../../useCases/sendNotification'
import { Ok } from '../../types'
const callsToEmailStub: Array<EmailProps> = []
const resetEmailStub = () => {
  while (callsToEmailStub.length) callsToEmailStub.shift()
}
const sendEmail = async (args: EmailProps) => {
  callsToEmailStub.push(args)
  return Ok(null)
}
const getCallsToEmailStub = () => {
  return callsToEmailStub
}

export { resetEmailStub, sendEmail, getCallsToEmailStub }
