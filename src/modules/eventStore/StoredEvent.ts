import {
  CandidateNotificationForPeriodeFailed,
  CandidateNotifiedForPeriode,
} from '../candidateNotification/events'
import {
  LegacyProjectEventSourced,
  LegacyProjectSourced,
  PeriodeNotified,
  ProjectCertificateGenerated,
  ProjectCertificateDownloaded,
  ProjectCertificateGenerationFailed,
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
  | PeriodeNotified
  | CandidateNotificationForPeriodeFailed
  | CandidateNotifiedForPeriode
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
