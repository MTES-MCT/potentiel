// Create a fake email service
const callsToEmailStub: Array<{ email: string; resetLink: string }> = []
const resetEmailStub = () => {
  while (callsToEmailStub.length) callsToEmailStub.shift()
}
const sendPasswordResetEmail = async (email: string, resetLink: string) => {
  callsToEmailStub.push({ email, resetLink })
}
const getCallsToEmailStub = () => {
  return callsToEmailStub
}

export { resetEmailStub, sendPasswordResetEmail, getCallsToEmailStub }
