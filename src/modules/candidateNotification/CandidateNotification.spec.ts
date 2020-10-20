import { UnwrapForTest } from '../../core/utils'
import {
  CandidateNotifiedForPeriode,
  ProjectCertificateGenerated,
  ProjectCertificateGenerationFailed,
  ProjectNotified,
} from '../project/events'
import { CandidateNotification } from './CandidateNotification'

const appelOffreId = 'appelOffre'
const periodeId = 'periode'
const familleId = 'famille'
const candidateEmail = 'candidate@email.test'
const candidateName = 'candidate'

const candidateProps = {
  appelOffreId,
  periodeId,
  candidateEmail,
}

describe('CandidateNotification', () => {
  describe('shouldCandidateBeNotified()', () => {
    describe('when all candidate projects have a certificate and CandidateNotifiedForPeriode has not occurred', () => {
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
      ])

      it('should return true', () => {
        expect(candidateNotification.shouldCandidateBeNotified()).toBe(true)
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

      it('should return false', () => {
        expect(candidateNotification.shouldCandidateBeNotified()).toBe(false)
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

      it('should return false', () => {
        expect(candidateNotification.shouldCandidateBeNotified()).toBe(false)
      })
    })
  })
})
