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
import makeFakeProject from '../../../__tests__/fixtures/project'
import { Timeline } from './Timeline'

export default { title: 'Nouvelle frise' }

const project = { ...makeFakeProject({ classe: 'Classé' }) }

export const adminGarantiesFinancieresDues = () => (
  <Timeline
    projectEventList={{
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
    project={project}
    now={new Date().getTime()}
  />
)

export const PPGarantiesFinancieresDues = () => (
  <Timeline
    projectEventList={{
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
    project={project}
    now={new Date().getTime()}
  />
)

export const PPGarantiesFinancieresEnRetard = () => (
  <Timeline
    projectEventList={{
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
    project={project}
    now={new Date('2022-01-12').getTime()}
  />
)

export const PPGarantiesFinancieresEtDCREnRetard = () => (
  <Timeline
    projectEventList={{
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
    project={project}
    now={new Date('2022-02-12').getTime()}
  />
)
export const garantiesFinancieresConstituees = () => (
  <Timeline
    projectEventList={{
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
    project={project}
    now={new Date().getTime()}
  />
)

export const GFConstitueesFichierManquant = () => (
  <Timeline
    projectEventList={{
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
    project={project}
    now={new Date().getTime()}
  />
)

export const PPDCRSupprimée = () => (
  <Timeline
    projectEventList={{
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
    project={project}
    now={new Date('2022-01-03').getTime()}
  />
)
export const PPDCRConstituée = () => (
  <Timeline
    projectEventList={{
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
    project={project}
    now={new Date('2022-01-03').getTime()}
  />
)

export const projetHistorique = () => (
  <Timeline
    projectEventList={{
      events: [
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: new Date('2022-01-12').getTime(),
          isLegacy: true,
        } as ProjectNotifiedDTO,
      ],
    }}
    project={project}
    now={new Date().getTime()}
  />
)

export const PPAttestationEnCoursDeGeneration = () => (
  <Timeline
    projectEventList={{
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
      ],
    }}
    project={project}
    now={new Date().getTime()}
  />
)

export const AdminAttestationEnCoursDeGeneration = () => (
  <Timeline
    projectEventList={{
      events: [
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
      ],
    }}
    project={project}
    now={new Date().getTime()}
  />
)

export const projetEliminé = () => (
  <Timeline
    projectEventList={{
      events: [
        {
          type: 'ProjectImported',
          variant: 'admin',
          date: new Date('2022-01-11').getTime(),
        } as ProjectImportedDTO,
      ],
    }}
    project={{ ...project, classe: 'Eliminé' }}
    now={new Date().getTime()}
  />
)

export const RecoursAccepte = () => (
  <Timeline
    projectEventList={{
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
    projectId={project.id}
    now={new Date().getTime()}
  />
)
