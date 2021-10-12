export const makeLegacyCandidateNotificationId = (args: { email: string; importId: string }) => {
  const { email, importId } = args
  const key = { email, importId }

  return JSON.stringify(key, Object.keys(key).sort()) // This makes the stringify stable (key order)
}
