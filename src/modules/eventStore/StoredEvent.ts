import {
  CandidateNotificationForPeriodeFailed,
  CandidateNotifiedForPeriode,
  CandidateInformationOfCertificateUpdateFailed,
  CandidateInformedOfCertificateUpdate,
} from '../candidateNotification/events'
import {
  LegacyProjectEventSourced,
  LegacyProjectSourced,
  PeriodeNotified,
  ProjectCertificateGenerated,
  ProjectCertificateDownloaded,
  ProjectCertificateGenerationFailed,
  ProjectCertificateUpdated,
  ProjectCertificateUpdateFailed,
  ProjectDCRDueDateSet,
  ProjectDCRRemoved,
  ProjectDCRSubmitted,
  ProjectGFDueDateSet,
  ProjectGFReminded,
  ProjectGFRemoved,
  ProjectGFSubmitted,
  ProjectImported,
  ProjectNotified,
  ProjectDataCorrected,
  ProjectNotificationDateSet,
  ProjectReimported,
} from '../project/events'

export type StoredEvent =
  | ProjectNotified
  | ProjectCertificateGenerated
  | ProjectCertificateDownloaded
  | ProjectCertificateGenerationFailed
  | ProjectCertificateUpdated
  | ProjectCertificateUpdateFailed
  | ProjectDCRDueDateSet
  | ProjectGFDueDateSet
  | LegacyProjectEventSourced
  | LegacyProjectSourced
  | ProjectImported
  | ProjectReimported
  | ProjectDCRRemoved
  | ProjectDCRSubmitted
  | ProjectGFSubmitted
  | ProjectGFRemoved
  | ProjectGFReminded
  | ProjectDataCorrected
  | ProjectNotificationDateSet
  | PeriodeNotified
  | CandidateNotificationForPeriodeFailed
  | CandidateNotifiedForPeriode
  | CandidateInformedOfCertificateUpdate
  | CandidateInformationOfCertificateUpdateFailed
