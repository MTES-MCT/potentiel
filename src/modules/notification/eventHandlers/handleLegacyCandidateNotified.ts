import { NotificationService } from '..'
import { LegacyCandidateNotified } from '../../legacyCandidateNotification'

export const handleLegacyCandidateNotified = (deps: {
  sendNotification: NotificationService['sendNotification']
}) => async (event: LegacyCandidateNotified) => {
  const { email, importId } = event.payload

  deps.sendNotification({
    type: 'legacy-candidate-notification',
    message: {
      email: email,
      name: '',
      subject: `Suivi des projets photovoltaïques et éolien CRE 4`,
    },
    context: {
      importId,
    },
    variables: {},
  })
}
