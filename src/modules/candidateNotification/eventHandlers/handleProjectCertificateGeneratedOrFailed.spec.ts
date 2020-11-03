import { UniqueEntityID } from '../../../core/domain'
import { okAsync, Result, ResultAsync } from '../../../core/utils'
import { StoredEvent } from '../../eventStore'
import { ProjectCertificateGenerated } from '../../project/events'
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared'
import { CandidateNotification } from '../CandidateNotification'
import { handleProjectCertificateGeneratedOrFailed } from './handleProjectCertificateGeneratedOrFailed'
import { v4 as uuid } from 'uuid'

describe('handleProjectCertificateGenerated', () => {
  it('should notify candidate if ready', async () => {
    const fakeCandidateNotification: CandidateNotification = {
      notifyCandidateIfReady: jest.fn(),
      pendingEvents: [] as StoredEvent[],
    }

    const candidateNotificationRepo = {
      load: jest.fn(),
      save: jest.fn(),
      transaction<K, E>(
        _: UniqueEntityID,
        cb: (aggregate: CandidateNotification) => ResultAsync<K, E> | Result<K, E>
      ) {
        return okAsync<null, E | EntityNotFoundError | InfraNotAvailableError>(null).andThen(() =>
          cb(fakeCandidateNotification)
        )
      },
    }

    await handleProjectCertificateGeneratedOrFailed({ candidateNotificationRepo })(
      new ProjectCertificateGenerated({
        payload: {
          projectId: 'project1',
          periodeId: 'periode',
          appelOffreId: 'appelOffre',
          candidateEmail: 'john@test.test',
          certificateFileId: uuid(),
        },
      })
    )

    expect(fakeCandidateNotification.notifyCandidateIfReady).toHaveBeenCalled()
  })
})
