import { UnwrapForTest } from '../../core/utils'
import {
  ProjectCertificateGenerated,
  ProjectCertificateGenerationFailed,
  ProjectNotified,
} from '../project/events'
import { EntityNotFoundError, HeterogeneousHistoryError } from '../shared'
import { makeCandidateNotificationId, makeCandidateNotification } from './CandidateNotification'
import { CandidateNotifiedForPeriode } from './events'

const appelOffreId = 'appelOffre'
const periodeId = 'periode'
const familleId = 'famille'
const candidateEmail = 'candidate@email.test'
const candidateName = 'candidate'

describe('CandidateNotification', () => {
  describe('makeCandidateNotification', () => {
    describe('when history is empty', () => {
      const candidateNotification = makeCandidateNotification([])

      it('should return a EntityNotFound error result', () => {
        expect(candidateNotification.isErr()).toBe(true)

        if (candidateNotification.isOk()) return

        expect(candidateNotification.error).toBeInstanceOf(EntityNotFoundError)
      })
    })

    describe('when history has events of different appel offre', () => {
      const candidateNotification = makeCandidateNotification([
        new ProjectNotified({
          payload: {
            projectId: '1',
            appelOffreId: 'appel1',
            periodeId,
            familleId,
            candidateEmail,
            candidateName,
            notifiedOn: 1,
          },
        }),
        new ProjectNotified({
          payload: {
            projectId: '2',
            appelOffreId: 'appel2',
            periodeId,
            familleId,
            candidateEmail,
            candidateName,
            notifiedOn: 1,
          },
        }),
      ])

      it('should return a HeterogeneousHistoryError error result', () => {
        expect(candidateNotification.isErr()).toBe(true)

        if (candidateNotification.isOk()) return

        expect(candidateNotification.error).toBeInstanceOf(HeterogeneousHistoryError)
      })
    })

    describe('when history has events of different periode', () => {
      const candidateNotification = makeCandidateNotification([
        new ProjectNotified({
          payload: {
            projectId: '1',
            appelOffreId,
            periodeId: 'periode1',
            familleId,
            candidateEmail,
            candidateName,
            notifiedOn: 1,
          },
        }),
        new ProjectNotified({
          payload: {
            projectId: '2',
            appelOffreId,
            periodeId: 'periode2',
            familleId,
            candidateEmail,
            candidateName,
            notifiedOn: 1,
          },
        }),
      ])

      it('should return a HeterogeneousHistoryError error result', () => {
        expect(candidateNotification.isErr()).toBe(true)

        if (candidateNotification.isOk()) return

        expect(candidateNotification.error).toBeInstanceOf(HeterogeneousHistoryError)
      })
    })

    describe('when history has events of different candidateEmail', () => {
      const candidateNotification = makeCandidateNotification([
        new ProjectNotified({
          payload: {
            projectId: '1',
            appelOffreId,
            periodeId,
            familleId,
            candidateEmail: 'email1@test.test',
            candidateName,
            notifiedOn: 1,
          },
        }),
        new ProjectNotified({
          payload: {
            projectId: '2',
            appelOffreId,
            periodeId,
            familleId,
            candidateEmail: 'email2@test.test',
            candidateName,
            notifiedOn: 1,
          },
        }),
      ])

      it('should return a HeterogeneousHistoryError error result', () => {
        expect(candidateNotification.isErr()).toBe(true)

        if (candidateNotification.isOk()) return

        expect(candidateNotification.error).toBeInstanceOf(HeterogeneousHistoryError)
      })
    })
  })

  describe('notifyCandidateIfReady()', () => {
    describe('when all candidate projects have a certificate and CandidateNotifiedForPeriode has not occurred', () => {
      const candidateNotification = UnwrapForTest(
        makeCandidateNotification([
          new ProjectNotified({
            payload: {
              projectId: '1',
              appelOffreId,
              periodeId,
              familleId,
              candidateEmail,
              candidateName,
              notifiedOn: 1,
            },
          }),
          new ProjectNotified({
            payload: {
              projectId: '2',
              appelOffreId,
              periodeId,
              familleId,
              candidateEmail,
              candidateName,
              notifiedOn: 1,
            },
          }),
          new ProjectCertificateGenerated({
            payload: {
              projectId: '1',
              appelOffreId,
              periodeId,
              candidateEmail,
              certificateFileId: '1',
            },
          }),
          new ProjectCertificateGenerationFailed({
            payload: {
              projectId: '2',
              appelOffreId,
              periodeId,
              candidateEmail,
              error: 'oops',
            },
            requestId: 'request1',
          }),
        ])
      )

      it('should trigger a CandidateNotifiedForPeriode', () => {
        expect(candidateNotification.pendingEvents).toHaveLength(0)

        candidateNotification.notifyCandidateIfReady()

        expect(candidateNotification.pendingEvents).toHaveLength(1)

        const event = candidateNotification.pendingEvents[0]
        expect(event!.type).toEqual(CandidateNotifiedForPeriode.type)

        expect(event!.payload).toEqual({
          candidateEmail,
          periodeId,
          appelOffreId,
          candidateName,
        })
        expect(event!.requestId).toEqual('request1')
        expect(event!.aggregateId).toEqual(
          makeCandidateNotificationId({
            appelOffreId,
            periodeId,
            candidateEmail,
          })
        )
      })
    })

    describe('when some candidate projects do not have a certificate yet', () => {
      const candidateNotification = UnwrapForTest(
        makeCandidateNotification([
          new ProjectNotified({
            payload: {
              projectId: '1',
              appelOffreId,
              periodeId,
              familleId,
              candidateEmail,
              candidateName,
              notifiedOn: 1,
            },
          }),
          new ProjectNotified({
            payload: {
              projectId: '2',
              appelOffreId,
              periodeId,
              familleId,
              candidateEmail,
              candidateName,
              notifiedOn: 1,
            },
          }),
          new ProjectCertificateGenerated({
            payload: {
              projectId: '1',
              appelOffreId,
              periodeId,
              candidateEmail,
              certificateFileId: '1',
            },
          }),
        ])
      )

      it('should not trigger events', () => {
        expect(candidateNotification.pendingEvents).toHaveLength(0)

        candidateNotification.notifyCandidateIfReady()

        expect(candidateNotification.pendingEvents).toHaveLength(0)
      })
    })

    describe('when CandidateNotifiedForPeriode exists', () => {
      const candidateNotification = UnwrapForTest(
        makeCandidateNotification([
          new CandidateNotifiedForPeriode({
            payload: {
              appelOffreId,
              periodeId,
              candidateEmail,
              candidateName,
            },
          }),
        ])
      )

      it('should not trigger events', () => {
        expect(candidateNotification.pendingEvents).toHaveLength(0)

        candidateNotification.notifyCandidateIfReady()

        expect(candidateNotification.pendingEvents).toHaveLength(0)
      })
    })
  })
})
