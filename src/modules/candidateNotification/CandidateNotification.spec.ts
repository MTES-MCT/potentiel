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
            aggregateId: CandidateNotification.makeId(candidateProps),
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
            aggregateId: CandidateNotification.makeId(candidateProps),
          }),
          new ProjectCertificateGenerated({
            payload: {
              projectId: '1',
              appelOffreId,
              periodeId,
              candidateEmail,
              certificateFileId: '1',
            },
            aggregateId: CandidateNotification.makeId(candidateProps),
          }),
          new ProjectCertificateGenerationFailed({
            payload: {
              projectId: '2',
              appelOffreId,
              periodeId,
              candidateEmail,
              error: 'oops',
            },
            aggregateId: CandidateNotification.makeId(candidateProps),
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
          aggregateId: CandidateNotification.makeId(candidateProps),
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
          aggregateId: CandidateNotification.makeId(candidateProps),
        }),
        new ProjectCertificateGenerated({
          payload: {
            projectId: '1',
            appelOffreId,
            periodeId,
            candidateEmail,
            certificateFileId: '1',
          },
          aggregateId: CandidateNotification.makeId(candidateProps),
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
          aggregateId: CandidateNotification.makeId(candidateProps),
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
