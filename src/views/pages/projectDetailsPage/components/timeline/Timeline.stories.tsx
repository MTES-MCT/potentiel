import React from 'react'
import {
  ProjectImportedDTO,
  ProjectNotifiedDTO,
  ProjectCertificateGeneratedDTO,
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
    } as ProjectCertificateGeneratedDTO,
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
  <Timeline projectEventList={projectEventList} user={admin} projectId={project.id} />
)
