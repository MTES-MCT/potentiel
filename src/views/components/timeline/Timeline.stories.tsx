import React from 'react'
import {
  ProjectImportedDTO,
  ProjectNotifiedDTO,
  ProjectCertificateGeneratedDTO,
  ProjectClaimedDTO,
  ProjectGFSubmittedDTO,
  ProjectGFDueDateSetDTO,
  ProjectDCRDueDateSetDTO,
  ProjectDCRSubmittedDTO,
  ProjectDCRRemovedDTO,
  ProjectPTFSubmittedDTO,
  ProjectGFInvalidatedDTO,
  ProjectNotificationDateSetDTO,
  ModificationRequestedDTO,
  ModificationRequestAcceptedDTO,
  ModificationRequestRejectedDTO,
  ModificationRequestCancelledDTO,
  ModificationRequestInstructionStartedDTO,
  ConfirmationRequestedDTO,
  ModificationRequestConfirmedDTO,
  ModificationReceivedDTO,
  ProjectGFUploadedDTO,
  ProjectGFWithdrawnDTO,
  LegacyModificationImportedDTO,
} from '@modules/frise'
import { Timeline } from './Timeline'

export default { title: 'Nouvelle frise' }

const project = {
  id: 'fake-project-id',
  isLaureat: true,
  isSoumisAuxGF: true,
  isGarantiesFinancieresDeposeesALaCandidature: false,
}

export const adminGarantiesFinancieresDues = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectImported',
          variant: 'admin',
          date: new Date('2022-01-11').getTime(),
        } as ProjectImportedDTO,
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'admin',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: 'porteur@test.test',
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ProjectGFDueDateSet',
          variant: 'admin',
          date: new Date('2022-01-13').getTime(),
        } as ProjectGFDueDateSetDTO,
        {
          type: 'ProjectDCRDueDateSet',
          variant: 'admin',
          date: new Date('2022-02-13').getTime(),
        } as ProjectDCRDueDateSetDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)

export const PPGarantiesFinancieresDues = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ProjectGFDueDateSet',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
        } as ProjectGFDueDateSetDTO,
        {
          type: 'ProjectDCRDueDateSet',
          variant: 'porteur-projet',
          date: new Date('2022-02-13').getTime(),
        } as ProjectDCRDueDateSetDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)

export const PPGarantiesFinancieresEnRetard = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-01').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ProjectGFDueDateSet',
          variant: 'porteur-projet',
          date: new Date('2022-01-03').getTime(),
        } as ProjectGFDueDateSetDTO,
        {
          type: 'ProjectDCRDueDateSet',
          variant: 'porteur-projet',
          date: new Date('2022-02-03').getTime(),
        } as ProjectDCRDueDateSetDTO,
      ],
    }}
    now={new Date('2022-01-12').getTime()}
  />
)

export const PPGarantiesFinancieresEtDCREnRetard = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-01').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ProjectGFDueDateSet',
          variant: 'porteur-projet',
          date: new Date('2022-01-03').getTime(),
        } as ProjectGFDueDateSetDTO,
        {
          type: 'ProjectDCRDueDateSet',
          variant: 'porteur-projet',
          date: new Date('2022-01-03').getTime(),
        } as ProjectDCRDueDateSetDTO,
      ],
    }}
    now={new Date('2022-02-12').getTime()}
  />
)
export const garantiesFinancieresConstituees = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectImported',
          variant: 'admin',
          date: new Date('2022-01-11').getTime(),
        } as ProjectImportedDTO,
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'admin',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: 'porteur@test.test',
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ProjectClaimed',
          variant: 'admin',
          date: new Date('2022-01-14').getTime(),
          potentielIdentifier: 'pot-id',
          certificateFileId: 'file-id',
          nomProjet: 'nom-projet',
          email: 'email',
          claimedBy: 'someone',
        } as ProjectClaimedDTO,
        {
          type: 'ProjectGFSubmitted',
          variant: 'admin',
          date: new Date('2022-01-17').getTime(),
          fileId: 'file-id',
          filename: 'file-name',
        } as ProjectGFSubmittedDTO,
        {
          type: 'ProjectGFInvalidated',
          variant: 'admin',
          date: new Date('2022-01-18').getTime(),
        } as ProjectGFInvalidatedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)

export const GFConstitueesFichierManquant = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectImported',
          variant: 'admin',
          date: new Date('2022-01-11').getTime(),
        } as ProjectImportedDTO,
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'admin',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: 'porteur@test.test',
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ProjectGFSubmitted',
          variant: 'admin',
          date: new Date('2022-01-17').getTime(),
          fileId: 'file-id',
        } as ProjectGFSubmittedDTO,
        {
          type: 'ProjectGFInvalidated',
          variant: 'admin',
          date: new Date('2022-01-18').getTime(),
        } as ProjectGFInvalidatedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)

export const PPDCRSupprimée = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-01').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectDCRDueDateSet',
          variant: 'porteur-projet',
          date: new Date('2022-01-03').getTime(),
        } as ProjectDCRDueDateSetDTO,
        {
          type: 'ProjectDCRSubmitted',
          variant: 'porteur-projet',
          date: new Date('2022-01-17').getTime(),
          file: { id: 'file-id', name: 'file-name' },
        } as ProjectDCRSubmittedDTO,
        {
          type: 'ProjectDCRRemoved',
          variant: 'porteur-projet',
          date: new Date('2022-01-17').getTime(),
          removedBy: 'someone',
        } as ProjectDCRRemovedDTO,
      ],
    }}
    now={new Date('2022-01-03').getTime()}
  />
)
export const PPDCRConstituée = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-01').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectDCRDueDateSet',
          variant: 'porteur-projet',
          date: new Date('2022-01-03').getTime(),
        } as ProjectDCRDueDateSetDTO,
        {
          type: 'ProjectDCRSubmitted',
          variant: 'porteur-projet',
          date: new Date('2022-01-17').getTime(),
          fileId: 'file-id',
          filename: 'file-name',
          submittedBy: 'someone',
          numeroDossier: 'DOSSIER-1',
        } as ProjectDCRSubmittedDTO,
        {
          type: 'ProjectPTFSubmitted',
          variant: 'porteur-projet',
          date: new Date('2022-01-16').getTime(),
          fileId: 'file-id',
          // filename: 'file-name',
        } as ProjectPTFSubmittedDTO,
      ],
    }}
    now={new Date('2022-01-03').getTime()}
  />
)

export const projetHistorique = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: new Date('2022-01-12').getTime(),
          isLegacy: true,
        } as ProjectNotifiedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)

export const PPAttestationEnCoursDeGeneration = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)

export const AdminAttestationEnCoursDeGeneration = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)

export const projetEliminé = () => (
  <Timeline
    projectEventList={{
      project: { ...project, isLaureat: false },
      events: [
        {
          type: 'ProjectImported',
          variant: 'admin',
          date: new Date('2022-01-11').getTime(),
        } as ProjectImportedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)

export const RecoursAccepte = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectNotificationDateSet',
          variant: 'admin',
          date: new Date('2022-01-20').getTime(),
        } as ProjectNotificationDateSetDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)

export const PuissanceRequestedForPP = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'admin',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: 'porteur@test.test',
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ModificationRequested',
          date: new Date('2022-01-14').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: 'id-1',
          authority: 'dreal',
          modificationType: 'puissance',
          puissance: 100,
          unitePuissance: 'MW',
        } as ModificationRequestedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)

export const DelayRequestedForPP = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'admin',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: 'porteur@test.test',
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ModificationRequested',
          date: new Date('2022-01-14').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: 'id-1',
          authority: 'dreal',
          modificationType: 'delai',
          delayInMonths: 2,
        } as ModificationRequestedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)

export const DelayRequestedInstructionStartedForPP = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ModificationRequested',
          date: new Date('2022-01-14').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: 'id-1',
          authority: 'dreal',
          modificationType: 'delai',
          delayInMonths: 2,
        } as ModificationRequestedDTO,
        {
          type: 'ModificationRequestInstructionStarted',
          date: new Date('2022-01-15').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: 'id-1',
        },
      ],
    }}
    now={new Date().getTime()}
  />
)

export const DelayAcceptedForPP = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ModificationRequested',
          date: new Date('2022-01-14').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: 'id-1',
          authority: 'dreal',
          modificationType: 'delai',
          delayInMonths: 2,
        } as ModificationRequestedDTO,
        {
          type: 'ModificationRequestAccepted',
          date: new Date('2022-01-14').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: 'id-1',
        } as ModificationRequestAcceptedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)

export const RecoursRejectedForPP = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ModificationRequested',
          date: new Date('2022-01-14').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: 'id-1',
          authority: 'dgec',
          modificationType: 'recours',
        } as ModificationRequestedDTO,
        {
          type: 'ModificationRequestRejected',
          date: new Date('2022-01-14').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: 'id-1',
          file: { id: 'id', name: 'name' },
        } as ModificationRequestRejectedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)
export const AbandonRequestCancelledForPP = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ModificationRequested',
          date: new Date('2022-01-14').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: 'id-1',
          authority: 'dgec',
          modificationType: 'abandon',
        } as ModificationRequestedDTO,
        {
          type: 'ModificationRequestCancelled',
          date: new Date('2022-01-14').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: 'id-1',
        } as ModificationRequestCancelledDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)

export const DelayRequestedForDreal = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'dreal',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ModificationRequested',
          date: new Date('2022-01-14').getTime(),
          variant: 'dreal',
          modificationRequestId: 'id-1',
          authority: 'dreal',
          modificationType: 'delai',
          delayInMonths: 2,
        } as ModificationRequestedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)

export const DelayRequestedInstructionStartedForDreal = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'dreal',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ModificationRequested',
          date: new Date('2022-01-14').getTime(),
          variant: 'dreal',
          modificationRequestId: 'id-1',
          authority: 'dreal',
          modificationType: 'delai',
          delayInMonths: 2,
        } as ModificationRequestedDTO,
        {
          type: 'ModificationRequestInstructionStarted',
          date: new Date('2022-01-15').getTime(),
          variant: 'dreal',
          modificationRequestId: 'id-1',
        },
      ],
    }}
    now={new Date().getTime()}
  />
)

export const RecoursRequestedForADMIN = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ModificationRequested',
          date: new Date('2022-01-14').getTime(),
          variant: 'admin',
          modificationRequestId: 'id-1',
          authority: 'dgec',
          modificationType: 'recours',
        } as ModificationRequestedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)

export const AbandonInstructionStartedForADMIN = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ModificationRequested',
          date: new Date('2022-01-14').getTime(),
          variant: 'admin',
          modificationRequestId: 'id-1',
          authority: 'dgec',
          modificationType: 'abandon',
        } as ModificationRequestedDTO,
        {
          type: 'ModificationRequestInstructionStarted',
          date: new Date('2022-01-14').getTime(),
          variant: 'admin',
          modificationRequestId: 'id-1',
          authority: 'dgec',
          modificationType: 'abandon',
        } as ModificationRequestInstructionStartedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)

export const AbandonEnAttenteDeConfirmationForPP = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ModificationRequested',
          date: new Date('2022-01-14').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: 'id-1',
          authority: 'dgec',
          modificationType: 'abandon',
        } as ModificationRequestedDTO,
        {
          type: 'ConfirmationRequested',
          date: new Date('2022-01-15').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: 'id-1',
          file: { id: 'id', name: 'name' },
        } as ConfirmationRequestedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)

export const AbandonEnAttenteDeConfirmationForADMIN = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'admin',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: 'email',
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ModificationRequested',
          date: new Date('2022-01-14').getTime(),
          variant: 'admin',
          modificationRequestId: 'id-1',
          authority: 'dgec',
          modificationType: 'abandon',
        } as ModificationRequestedDTO,
        {
          type: 'ConfirmationRequested',
          date: new Date('2022-01-15').getTime(),
          variant: 'admin',
          modificationRequestId: 'id-1',
          file: { id: 'id', name: 'name' },
        } as ConfirmationRequestedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)

export const AbandonConfirméForADMIN = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'admin',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: 'email',
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ModificationRequested',
          date: new Date('2022-01-14').getTime(),
          variant: 'admin',
          modificationRequestId: 'id-1',
          authority: 'dgec',
          modificationType: 'abandon',
        } as ModificationRequestedDTO,
        {
          type: 'ConfirmationRequested',
          date: new Date('2022-01-15').getTime(),
          variant: 'admin',
          modificationRequestId: 'id-1',
          file: { id: 'id', name: 'name' },
        } as ConfirmationRequestedDTO,
        {
          type: 'ModificationRequestConfirmed',
          date: new Date('2022-01-15').getTime(),
          variant: 'admin',
          modificationRequestId: 'id-1',
        } as ModificationRequestConfirmedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)

export const AbandonConfirméForPP = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2019-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2019-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ModificationRequested',
          date: new Date('2022-01-14').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: 'id-1',
          authority: 'dgec',
          modificationType: 'abandon',
        } as ModificationRequestedDTO,
        {
          type: 'ConfirmationRequested',
          date: new Date('2022-01-15').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: 'id-1',
          file: { id: 'id', name: 'name' },
        } as ConfirmationRequestedDTO,
        {
          type: 'ModificationRequestConfirmed',
          date: new Date('2022-01-15').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: 'id-1',
        } as ModificationRequestConfirmedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)

export const PPModificationReceived = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ModificationReceived',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
          modificationType: 'actionnaire',
          actionnaire: 'nomActionnaire',
        } as ModificationReceivedDTO,
        {
          type: 'ModificationReceived',
          variant: 'porteur-projet',
          date: new Date('2022-02-13').getTime(),
          modificationType: 'fournisseur',
          fournisseurs: [
            { kind: 'Nom du fabricant \n(Modules ou films)', name: 'name1' },
            { kind: 'Nom du fabricant \n(Polysilicium)', name: 'name2' },
          ],
        } as ModificationReceivedDTO,
        {
          type: 'ModificationReceived',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
          modificationType: 'puissance',
          puissance: 2,
          unitePuissance: 'MW',
        } as ModificationReceivedDTO,
        {
          type: 'ModificationReceived',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
          modificationType: 'producteur',
          producteur: 'nomProducteur',
        } as ModificationReceivedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)

export const drealGarantiesFinancieresNotUploaded = () => (
  <Timeline
    projectEventList={{
      project: { ...project, isGarantiesFinancieresDeposeesALaCandidature: true },
      events: [
        {
          type: 'ProjectNotified',
          variant: 'dreal',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectDCRDueDateSet',
          variant: 'dreal',
          date: new Date('2022-02-13').getTime(),
        } as ProjectDCRDueDateSetDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)

export const PPGarantiesFinancieresNotUploaded = () => (
  <Timeline
    projectEventList={{
      project: { ...project, isGarantiesFinancieresDeposeesALaCandidature: true },
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ProjectDCRDueDateSet',
          variant: 'porteur-projet',
          date: new Date('2022-02-13').getTime(),
        } as ProjectDCRDueDateSetDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)

export const drealGarantiesFinancieresUploaded = () => (
  <Timeline
    projectEventList={{
      project: { ...project, isGarantiesFinancieresDeposeesALaCandidature: true },
      events: [
        {
          type: 'ProjectNotified',
          variant: 'dreal',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectDCRDueDateSet',
          variant: 'dreal',
          date: new Date('2022-02-13').getTime(),
        } as ProjectDCRDueDateSetDTO,
        {
          type: 'ProjectGFUploaded',
          variant: 'dreal',
          date: new Date('2022-01-17').getTime(),
          fileId: 'file-id',
          filename: 'file-name',
        } as ProjectGFUploadedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)

export const PPGarantiesFinancieresUploaded = () => (
  <Timeline
    projectEventList={{
      project: { ...project, isGarantiesFinancieresDeposeesALaCandidature: true },
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ProjectDCRDueDateSet',
          variant: 'porteur-projet',
          date: new Date('2022-02-13').getTime(),
        } as ProjectDCRDueDateSetDTO,
        {
          type: 'ProjectGFUploaded',
          variant: 'porteur-projet',
          date: new Date('2022-01-17').getTime(),
          fileId: 'file-id',
          filename: 'file-name',
        } as ProjectGFUploadedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)

export const PPGarantiesFinancieresWithdrawn = () => (
  <Timeline
    projectEventList={{
      project: { ...project, isGarantiesFinancieresDeposeesALaCandidature: true },
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ProjectDCRDueDateSet',
          variant: 'porteur-projet',
          date: new Date('2022-02-13').getTime(),
        } as ProjectDCRDueDateSetDTO,
        {
          type: 'ProjectGFWithdrawn',
          variant: 'porteur-projet',
          date: new Date('2022-01-17').getTime(),
        } as ProjectGFWithdrawnDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)

export const LegacyModificationsAndDelayRequestForPP = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2019-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2019-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'LegacyModificationImported',
          date: new Date('2019-01-15').getTime(),
          variant: 'porteur-projet',
          modificationType: 'delai',
          ancienneDateLimiteAchevement: new Date('2022-01-15').getTime(),
          nouvelleDateLimiteAchevement: new Date('2024-01-15').getTime(),
        } as LegacyModificationImportedDTO,
        {
          type: 'LegacyModificationImported',
          date: new Date('2019-01-16').getTime(),
          variant: 'porteur-projet',
          modificationType: 'producteur',
          producteurPrecedent: 'ancien producteur',
        } as LegacyModificationImportedDTO,
        {
          type: 'LegacyModificationImported',
          date: new Date('2019-01-16').getTime(),
          variant: 'porteur-projet',
          modificationType: 'autre',
          column: 'Puissance installé du projet indiquée au B. du formulaire de candidature (MWc)',
          value: '24',
        } as LegacyModificationImportedDTO,
        {
          type: 'ModificationRequested',
          date: new Date('2022-01-14').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: 'id-1',
          authority: 'dreal',
          modificationType: 'delai',
          delayInMonths: 2,
        } as ModificationRequestedDTO,
        {
          type: 'ModificationRequestAccepted',
          date: new Date('2022-01-14').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: 'id-1',
        } as ModificationRequestAcceptedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)

export const LegacyRecoursRejectedForPP = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2019-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2019-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'LegacyModificationImported',
          date: new Date('2019-01-15').getTime(),
          variant: 'porteur-projet',
          modificationType: 'recours',
          accepted: false,
        } as LegacyModificationImportedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
)
