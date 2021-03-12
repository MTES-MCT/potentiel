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
  CertificatesForPeriodeRegenerated,
  ProjectCertificateGenerated,
  ProjectCertificateRegenerated,
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
  ProjectClasseGranted,
  ProjectPTFRemoved,
  ProjectPTFSubmitted,
  NumeroGestionnaireSubmitted,
} from '../project/events'
import {
  ModificationRequested,
  ModificationRequestAccepted,
  ModificationRequestRejected,
  ModificationRequestInstructionStarted,
  ResponseTemplateDownloaded,
} from '../modificationRequest/events'
import { UserRightsToProjectRevoked, InvitationToProjectCancelled } from '../authorization'

export type StoredEvent =
  | ProjectNotified
  | ProjectCertificateGenerated
  | ProjectCertificateRegenerated
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
  | ProjectPTFSubmitted
  | ProjectPTFRemoved
  | ProjectDataCorrected
  | ProjectNotificationDateSet
  | ProjectCertificateUpdated
  | ProjectCertificateUpdateFailed
  | NumeroGestionnaireSubmitted
  | PeriodeNotified
  | CertificatesForPeriodeRegenerated
  | CandidateNotificationForPeriodeFailed
  | CandidateNotifiedForPeriode
  | CandidateInformedOfCertificateUpdate
  | CandidateInformationOfCertificateUpdateFailed
  | ProjectClasseGranted
  | ModificationRequested
  | ModificationRequestRejected
  | ModificationRequestAccepted
  | ModificationRequestInstructionStarted
  | ResponseTemplateDownloaded
  | UserRightsToProjectRevoked
  | InvitationToProjectCancelled
