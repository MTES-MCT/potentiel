import { handleProjectImported } from './handleProjectImported'
import {
  fakeTransactionalRepo,
  makeFakeLegacyCandidateNotification,
} from '../../../__tests__/fixtures/aggregates'
import { ProjectImported, ProjectReimported } from '../../project'

const appelOffreId = 'appelOffreId'
const periodeId = 'periodeId'
const familleId = 'familleId'
const numeroCRE = 'numeroCRE'
const projectId = 'projectId'
const importId = 'importId'
const email = 'test@test.tests'

describe('legacyCandidateNotification.handleProjectImported', () => {
  describe('when receiving a ProjectImported event', () => {
    const data = { email } as unknown as ProjectImported['payload']['data']
    const event = new ProjectImported({
      payload: {
        appelOffreId,
        periodeId,
        familleId,
        potentielIdentifier: '',
        numeroCRE,
        projectId,
        importId,
        data,
      },
    })
    describe('when project is in legacy periode', () => {
      const isPeriodeLegacy = async () => true

      it('should open a transaction and call LegacyCandidateNotification.notify()', async () => {
        const legacyCandidateNotification = makeFakeLegacyCandidateNotification()

        const legacyCandidateNotificationRepo = fakeTransactionalRepo(legacyCandidateNotification)

        await handleProjectImported({
          isPeriodeLegacy,
          legacyCandidateNotificationRepo,
        })(event)

        expect(legacyCandidateNotification.notify).toHaveBeenCalled()
      })
    })

    describe('when project is not in legacy periode', () => {
      const isPeriodeLegacy = async () => false

      it('should do nothing', async () => {
        const legacyCandidateNotificationRepo = {
          transaction: jest.fn(),
        }
        await handleProjectImported({
          isPeriodeLegacy,
          legacyCandidateNotificationRepo,
        })(event)

        expect(legacyCandidateNotificationRepo.transaction).not.toHaveBeenCalled()
      })
    })
  })

  describe('when receiving a ProjectReimported event', () => {
    describe('when ProjectReimported contains a changed eamil', () => {
      const event = new ProjectReimported({
        payload: {
          appelOffreId,
          periodeId,
          familleId,
          projectId,
          importId,
          data: { email },
        },
      })

      describe('when project is in legacy periode', () => {
        const isPeriodeLegacy = async () => true

        it('should open a transaction and call LegacyCandidateNotification.notify()', async () => {
          const legacyCandidateNotification = makeFakeLegacyCandidateNotification()

          const legacyCandidateNotificationRepo = fakeTransactionalRepo(legacyCandidateNotification)

          await handleProjectImported({
            isPeriodeLegacy,
            legacyCandidateNotificationRepo,
          })(event)

          expect(legacyCandidateNotification.notify).toHaveBeenCalled()
        })
      })

      describe('when project is not in legacy periode', () => {
        const isPeriodeLegacy = async () => false

        it('should do nothing', async () => {
          const legacyCandidateNotificationRepo = {
            transaction: jest.fn(),
          }
          await handleProjectImported({
            isPeriodeLegacy,
            legacyCandidateNotificationRepo,
          })(event)

          expect(legacyCandidateNotificationRepo.transaction).not.toHaveBeenCalled()
        })
      })
    })

    describe('when ProjectReimported does not contain a changed eamil', () => {
      const event = new ProjectReimported({
        payload: {
          appelOffreId,
          periodeId,
          familleId,
          projectId,
          importId,
          data: { numeroCRE: '123' },
        },
      })
      const isPeriodeLegacy = jest.fn()

      it('should do nothing', async () => {
        const legacyCandidateNotificationRepo = {
          transaction: jest.fn(),
        }
        await handleProjectImported({
          isPeriodeLegacy,
          legacyCandidateNotificationRepo,
        })(event)

        expect(legacyCandidateNotificationRepo.transaction).not.toHaveBeenCalled()
      })
    })
  })
})
