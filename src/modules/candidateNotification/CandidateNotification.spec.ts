import { UnwrapForTest } from '../../core/utils'
import {
  ProjectCertificateGenerated,
  ProjectCertificateGenerationFailed,
  ProjectNotified,
} from '../project/events'
import { CandidateNotification } from './CandidateNotification'
import { CandidateNotifiedForPeriode } from './events'

const appelOffreId = 'appelOffre'
const periodeId = 'periode'
const familleId = 'famille'
const candidateEmail = 'candidate@email.test'
const candidateName = 'candidate'

const candidateProps = {
  appelOffreId,
  periodeId,
  candidateEmail,
  candidateName,
}

describe('CandidateNotification', () => {
  describe('reloadFromHistory()', () => {
    describe('when all candidate projects have a certificate and CandidateNotifiedForPeriode has not occurred', () => {
      const candidateNotification = UnwrapForTest(
        CandidateNotification.create(candidateProps)
      )
      candidateNotification.reloadFromHistory(
        [
          new ProjectNotified({
            payload: {
              projectId: '1',
              appelOffreId,
              periodeId,
              familleId,
              candidateEmail,
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
          }),
        ],
        'request1'
      )

      it('should trigger a CandidateNotifiedForPeriode', () => {
        expect(candidateNotification.domainEvents).toHaveLength(1)

        const event = candidateNotification.domainEvents[0]
        expect(event!.type).toEqual(CandidateNotifiedForPeriode.type)

        expect(event!.payload).toEqual({
          candidateEmail,
          periodeId,
          appelOffreId,
          candidateName,
        })
        expect(event!.requestId).toEqual('request1')
        expect(event!.aggregateId).toEqual(
          CandidateNotification.makeId({
            appelOffreId,
            periodeId,
            candidateEmail,
          })
        )
      })
    })

    describe('when some candidate projects do not have a certificate yet', () => {
      const candidateNotification = UnwrapForTest(
        CandidateNotification.create(candidateProps)
      )
      candidateNotification.reloadFromHistory([
        new ProjectNotified({
          payload: {
            projectId: '1',
            appelOffreId,
            periodeId,
            familleId,
            candidateEmail,
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

      it('should not trigger events', () => {
        expect(candidateNotification.domainEvents).toHaveLength(0)
      })
    })

    describe('when CandidateNotifiedForPeriode exists', () => {
      const candidateNotification = UnwrapForTest(
        CandidateNotification.create(candidateProps)
      )
      candidateNotification.reloadFromHistory([
        new CandidateNotifiedForPeriode({
          payload: {
            appelOffreId,
            periodeId,
            candidateEmail,
            candidateName,
          },
        }),
      ])

      it('should not trigger events', () => {
        expect(candidateNotification.domainEvents).toHaveLength(0)
      })
    })

    describe('when history is empty', () => {
      const candidateNotification = UnwrapForTest(
        CandidateNotification.create(candidateProps)
      )
      candidateNotification.reloadFromHistory([])

      it('should not trigger events', () => {
        expect(candidateNotification.domainEvents).toHaveLength(0)
      })
    })
  })
})
