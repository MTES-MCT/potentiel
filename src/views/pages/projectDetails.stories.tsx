import React from 'react'

import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeRequest from '../../__tests__/fixtures/request'
import makeFakeUser from '../../__tests__/fixtures/user'

import ProjectDetails from './projectDetails'

export default { title: 'Project page' }

export const forAdmins = () => (
  <ProjectDetails
    request={makeFakeRequest({ user: makeFakeUser({ role: 'admin' }) })}
    project={makeFakeProject({
      classe: 'Classé',
    })}
  />
)

export const forPorteurProjet = () => (
  <ProjectDetails
    request={makeFakeRequest({
      user: makeFakeUser({ role: 'porteur-projet' }),
    })}
    project={makeFakeProject({
      classe: 'Classé',
    })}
  />
)
