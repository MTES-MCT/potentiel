import {
  fakeTransactionalRepo,
  makeFakeCandidateNotification,
} from '../../../__tests__/fixtures/aggregates'
import { ProjectCertificateGenerated } from '../../project/events'
import { handleProjectCertificateGeneratedOrFailed } from './handleProjectCertificateGeneratedOrFailed'
import { v4 as uuid } from 'uuid'

describe('handleProjectCertificateGenerated', () => {
  it('should notify candidate if ready', async () => {
    const fakeCandidateNotification = makeFakeCandidateNotification()

    const candidateNotificationRepo = fakeTransactionalRepo(fakeCandidateNotification)

    await handleProjectCertificateGeneratedOrFailed({ candidateNotificationRepo })(
      new ProjectCertificateGenerated({
        payload: {
          projectId: 'project1',
          periodeId: 'periode',
          projectVersionDate: new Date(),
          appelOffreId: 'appelOffre',
          candidateEmail: 'john@test.test',
          certificateFileId: uuid(),
        },
      })
    )

    expect(fakeCandidateNotification.notifyCandidateIfReady).toHaveBeenCalled()
  })
})
