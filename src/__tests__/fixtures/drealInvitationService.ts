// Create a fake email service
interface EmailServiceProps {
  destinationEmail: string
  subject: string
  invitationLink: string
}
const callsToEmailStub: Array<EmailServiceProps> = []
const resetEmailStub = () => {
  while (callsToEmailStub.length) callsToEmailStub.shift()
}
const sendDrealInvitation = async (args: EmailServiceProps) => {
  callsToEmailStub.push(args)
}
const getCallsToEmailStub = () => {
  return callsToEmailStub
}

export { resetEmailStub, sendDrealInvitation, getCallsToEmailStub }
