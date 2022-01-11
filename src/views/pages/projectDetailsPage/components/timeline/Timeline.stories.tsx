import React from 'react'
import {
  ProjectImportedDTO,
  ProjectNotifiedDTO,
  ProjectCertificateGeneratedDTO,
  ProjectClaimedDTO,
  ProjectGFSubmittedDTO,
} from '../../../../../modules/frise/dtos/ProjectEventListDTO'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { Timeline } from './Timeline'

export default { title: 'Nouvelle frise' }

const project = { ...makeFakeProject() }

const projectEventList = {
  events: [
    {
      type: 'ProjectImported',
      variant: 'admin',
      date: 11,
    } as ProjectImportedDTO,
    {
      type: 'ProjectNotified',
      variant: 'admin',
      date: 12,
    } as ProjectNotifiedDTO,
    {
      type: 'ProjectCertificateGenerated',
      variant: 'admin',
      date: 13,
      certificateFileId: 'file-id',
      nomProjet: 'mon projet pv',
      email: 'porteur@test.test',
      potentielIdentifier: 'pot-id',
    } as ProjectCertificateGeneratedDTO,
    {
      type: 'ProjectClaimed',
      variant: 'admin',
      date: 14,
      potentielIdentifier: 'pot-id',
      certificateFileId: 'file-id',
      nomProjet: 'nom-projet',
      email: 'email',
      claimedBy: 'someone',
    } as ProjectClaimedDTO,
    {
      type: 'ProjectGFSubmitted',
      variant: 'admin',
      date: 17,
      fileId: 'file-id',
      filename: 'file-name',
      submittedBy: 'someone',
    } as ProjectGFSubmittedDTO,
  ],
}

const admin = {
  id: '1',
  fullName: 'nom prénom',
  email: 'email',
  role: 'admin' as 'admin',
}

/*
const dgec = {
  id: '1',
  fullName: 'nom prénom',
  email: 'email',
  role: 'dgec' as 'dgec',
}

const ademe = {
  id: '1',
  fullName: 'nom prénom',
  email: 'email',
  role: 'ademe' as 'ademe',
}

const porteurProjet = {
  id: '1',
  fullName: 'nom prénom',
  email: 'email',
  role: 'porteur-projet' as 'porteur-projet',
}
*/
export const timeline = () => (
  <Timeline projectEventList={projectEventList} projectId={project.id} now={new Date().getTime()} />
)
