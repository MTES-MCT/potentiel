import React from 'react'

import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeRequest from '../../__tests__/fixtures/request'

export default { title: 'List Projects' }

import { appelsOffreStatic } from '@dataAccess/inMemory'
import { ListeProjets } from './ListeProjetsPage'

export const withFilters = () => (
  <ListeProjets
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
    existingAppelsOffres={appelsOffreStatic.map((item) => item.id)}
    appelsOffre={appelsOffreStatic}
  />
)

export const withError = () => (
  <ListeProjets
    request={makeFakeRequest({
      query: { error: 'This is an error message!' },
    })}
    existingAppelsOffres={[]}
    appelsOffre={appelsOffreStatic}
  />
)

export const withSuccess = () => (
  <ListeProjets
    request={makeFakeRequest({
      query: { success: 'This is a success message!' },
    })}
    existingAppelsOffres={[]}
    appelsOffre={appelsOffreStatic}
  />
)

export const adminWithProjects = () => (
  <ListeProjets
    request={makeFakeRequest({}, { role: 'admin' })}
    appelsOffre={appelsOffreStatic}
    existingAppelsOffres={[appelsOffreStatic[0].id]}
    projects={{
      itemCount: 3,
      pagination: {
        page: 0,
        pageSize: 10,
      },
      pageCount: 1,
      items: [
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
      ],
    }}
  />
)

export const drealWithProjects = () => (
  <ListeProjets
    request={makeFakeRequest({}, { role: 'dreal' })}
    appelsOffre={appelsOffreStatic}
    existingAppelsOffres={[appelsOffreStatic[0].id]}
    projects={{
      itemCount: 3,
      pagination: {
        page: 0,
        pageSize: 10,
      },
      pageCount: 1,
      items: [
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
      ],
    }}
  />
)

export const porteurProjetWithProjects = () => (
  <ListeProjets
    request={makeFakeRequest({}, { role: 'porteur-projet' })}
    appelsOffre={appelsOffreStatic}
    existingAppelsOffres={[appelsOffreStatic[0].id]}
    projects={{
      itemCount: 3,
      pagination: {
        page: 0,
        pageSize: 10,
      },
      pageCount: 1,
      items: [
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
      ],
    }}
  />
)
