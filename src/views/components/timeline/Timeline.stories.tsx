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
  ProjectGFValidatedDTO,
} from '../../../modules/frise'
import makeFakeProject from '../../../__tests__/fixtures/project'
import { Timeline } from './Timeline'

export default { title: 'Nouvelle frise' }

const project = { ...makeFakeProject() }

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
    projectId={project.id}
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
    projectId={project.id}
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
    projectId={project.id}
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
    projectId={project.id}
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
          type: 'ProjectGFValidated',
          variant: 'admin',
          date: new Date('2022-01-18').getTime(),
        } as ProjectGFValidatedDTO,
      ],
    }}
    projectId={project.id}
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
        } as ProjectGFSubmittedDTO,
      ],
    }}
    projectId={project.id}
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
          fileId: 'file-id',
          filename: 'file-name',
          submittedBy: 'someone',
        } as ProjectDCRSubmittedDTO,
        {
          type: 'ProjectDCRRemoved',
          variant: 'porteur-projet',
          date: new Date('2022-01-17').getTime(),
          removedBy: 'someone',
        } as ProjectDCRRemovedDTO,
      ],
    }}
    projectId={project.id}
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
        } as ProjectDCRSubmittedDTO,
        {
          type: 'ProjectPTFSubmitted',
          variant: 'porteur-projet',
          date: new Date('2022-01-16').getTime(),
          fileId: 'file-id',
          // filename: 'file-name',
          submittedBy: 'someone',
        } as ProjectPTFSubmittedDTO,
      ],
    }}
    projectId={project.id}
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
    projectId={project.id}
    now={new Date().getTime()}
  />
)

export const attestationEnCoursDeGeneration = () => (
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
    projectId={project.id}
    now={new Date().getTime()}
  />
)
