import React from 'react'

import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeRequest from '../../__tests__/fixtures/request'
import makeFakeUser from '../../__tests__/fixtures/user'

import ListProjects from './listProjects'

export default { title: 'List Projects' }

import { appelsOffreStatic } from '../../dataAccess/inMemory/appelOffre'

export const withFilters = () => (
  <ListProjects
    request={makeFakeRequest(
      {
        query: {
          classement: 'classés',
          appelOffreId: 'Fessenheim',
          garantiesFinancieres: 'notSubmitted',
        },
      },
      { role: 'porteur-projet' }
    )}
    projects={[]}
    appelsOffre={appelsOffreStatic}
  />
)

export const withError = () => (
  <ListProjects
    request={makeFakeRequest({
      query: { error: 'This is an error message!' },
    })}
    projects={[]}
    appelsOffre={appelsOffreStatic}
  />
)

export const withSuccess = () => (
  <ListProjects
    request={makeFakeRequest({
      query: { success: 'This is a success message!' },
    })}
    projects={[]}
    appelsOffre={appelsOffreStatic}
  />
)

export const adminWithProjects = () => (
  <ListProjects
    request={makeFakeRequest({}, { role: 'admin' })}
    appelsOffre={appelsOffreStatic}
    projects={[
      makeFakeProject({
        isFinancementParticipatif: true,
      }),
      makeFakeProject({
        classe: 'Classé',
        isFinancementParticipatif: true,
      }),
      makeFakeProject({
        classe: 'Classé',
        isInvestissementParticipatif: true,
      }),
      makeFakeProject({
        classe: 'Classé',
      }),
    ]}
  />
)

export const drealWithProjects = () => (
  <ListProjects
    request={makeFakeRequest({}, { role: 'dreal' })}
    appelsOffre={appelsOffreStatic}
    projects={[
      makeFakeProject({
        isFinancementParticipatif: true,
      }),
      makeFakeProject({
        classe: 'Classé',
        isFinancementParticipatif: true,
      }),
      makeFakeProject({
        classe: 'Classé',
        isInvestissementParticipatif: true,
      }),
      makeFakeProject({
        classe: 'Classé',
      }),
    ]}
  />
)

export const porteurProjetWithProjects = () => (
  <ListProjects
    request={makeFakeRequest({}, { role: 'porteur-projet' })}
    appelsOffre={appelsOffreStatic}
    projects={[
      makeFakeProject({
        isFinancementParticipatif: true,
      }),
      makeFakeProject({
        classe: 'Classé',
        isFinancementParticipatif: true,
      }),
      makeFakeProject({
        classe: 'Classé',
        isInvestissementParticipatif: true,
      }),
      makeFakeProject({
        classe: 'Classé',
      }),
    ]}
  />
)
