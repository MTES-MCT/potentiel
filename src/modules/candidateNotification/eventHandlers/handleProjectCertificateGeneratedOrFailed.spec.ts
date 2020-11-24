import {
  fakeTransactionalRepo,
  makeFakeCandidateNotification,
} from '../../../__tests__/fixtures/aggregates'
import { ProjectCertificateGenerated } from '../../project/events'
import { handleProjectCertificateGeneratedOrFailed } from './handleProjectCertificateGeneratedOrFailed'

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
          certificateFileId: 'certificateFile1',
        },
      })
    )

    expect(fakeCandidateNotification.notifyCandidateIfReady).toHaveBeenCalled()
  })
})
