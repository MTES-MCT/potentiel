// Create a fake email service
interface EmailServiceProps {
  template: 'lauréat' | 'eliminé'
  destinationEmail: string
  destinationName: string
  subject: string
  invitationLink: string
}
const callsToEmailStub: Array<EmailServiceProps> = []
const resetEmailStub = () => {
  while (callsToEmailStub.length) callsToEmailStub.shift()
}
const sendEmailNotification = async (args: EmailServiceProps) => {
  callsToEmailStub.push(args)
}
const getCallsToEmailStub = () => {
  return callsToEmailStub
}

export { resetEmailStub, sendEmailNotification, getCallsToEmailStub }
