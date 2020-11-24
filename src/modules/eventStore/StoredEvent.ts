import {
  CandidateInformationOfCertificateUpdateFailed,
  CandidateInformedOfCertificateUpdate,
  CandidateNotificationForPeriodeFailed,
  CandidateNotifiedForPeriode,
} from '../candidateNotification/events'
import {
  LegacyProjectEventSourced,
  LegacyProjectSourced,
  PeriodeNotified,
  ProjectCertificateGenerated,
  ProjectCertificateRegenerated,
  ProjectCertificateDownloaded,
  ProjectCertificateGenerationFailed,
  ProjectCertificateUploaded,
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
  ProjectClasseGranted,
} from '../project/events'

export type StoredEvent =
  | ProjectNotified
  | ProjectCertificateGenerated
  | ProjectCertificateRegenerated
  | ProjectCertificateDownloaded
  | ProjectCertificateGenerationFailed
  | ProjectCertificateUploaded
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
  | ProjectCertificateUploaded
  | ProjectCertificateUpdateFailed
  | PeriodeNotified
  | CandidateNotificationForPeriodeFailed
  | CandidateNotifiedForPeriode
  | CandidateInformedOfCertificateUpdate
  | CandidateInformationOfCertificateUpdateFailed
  | ProjectClasseGranted
