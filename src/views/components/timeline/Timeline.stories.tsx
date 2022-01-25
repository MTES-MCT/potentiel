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
} from '@modules/frise'
import { Timeline } from './Timeline'

export default { title: 'Nouvelle frise' }

const project = { id: 'fake-project-id', isLaureat: true }

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
          variant: 'admin',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: 'porteur@test.test',
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
          variant: 'admin',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: 'porteur@test.test',
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
          variant: 'admin',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: 'porteur@test.test',
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
