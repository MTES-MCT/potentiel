import React from 'react'

import makeFakeRequest from '../../__tests__/fixtures/request'

export default { title: 'List Projects' }

import { appelsOffreStatic } from '@dataAccess/inMemory'
import { ListeProjetsPage } from './ListeProjetsPage'

const projects = {
  itemCount: 3,
  pagination: {
    page: 0,
    pageSize: 10,
  },
  pageCount: 1,
  items: [
    makeFakeProjectListItem({
      isFinancementParticipatif: true,
    }),
    makeFakeProjectListItem({
      classe: 'Classé',
      isFinancementParticipatif: true,
    }),
    makeFakeProjectListItem({
      classe: 'Classé',
      isInvestissementParticipatif: true,
    }),
    makeFakeProjectListItem({
      classe: 'Classé',
    }),
  ],
}

export const withFilters = () => (
  <ListeProjetsPage
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
    projects={projects}
  />
)

export const withError = () => (
  <ListeProjetsPage
    request={makeFakeRequest({
      query: { error: 'This is an error message!' },
    })}
    existingAppelsOffres={[]}
    appelsOffre={appelsOffreStatic}
    projects={{
      itemCount: 0,
      pagination: {
        page: 0,
        pageSize: 10,
      },
      pageCount: 1,
      items: [],
    }}
  />
)

export const withSuccess = () => (
  <ListeProjetsPage
    request={makeFakeRequest({
      query: { success: 'This is a success message!' },
    })}
    existingAppelsOffres={[]}
    appelsOffre={appelsOffreStatic}
    projects={projects}
  />
)

export const adminWithProjects = () => (
  <ListeProjetsPage
    request={makeFakeRequest({}, { role: 'admin' })}
    appelsOffre={appelsOffreStatic}
    existingAppelsOffres={[appelsOffreStatic[0].id]}
    projects={projects}
  />
)

export const drealWithProjects = () => (
  <ListeProjetsPage
    request={makeFakeRequest({}, { role: 'dreal' })}
    appelsOffre={appelsOffreStatic}
    existingAppelsOffres={[appelsOffreStatic[0].id]}
    projects={projects}
  />
)

export const porteurProjetWithProjects = () => (
  <ListeProjetsPage
    request={makeFakeRequest({}, { role: 'porteur-projet' })}
    appelsOffre={appelsOffreStatic}
    existingAppelsOffres={[appelsOffreStatic[0].id]}
    projects={projects}
  />
)

function makeFakeProjectListItem(overrides?) {
  const defaultObj = {
    id: 'id',
    nomCandidat: 'Mr Porter',
    nomProjet: 'Mon projet PV',
    puissance: '100',
    prixReference: 87.9,
    evaluationCarbone: 4.4,
    nomRepresentantLegal: 'nomRepresentantLegal',
    email: 'email@address.com',
    communeProjet: 'communeProjet',
    departementProjet: 'departementProjet',
    regionProjet: 'regionProjet',
    classe: 'Eliminé',
    isInvestissementParticipatif: false,
    isFinancementParticipatif: false,
    actionnariat: '',
    appelOffre: {
      type: 'sol',
      unitePuissance: 'MWh',
      periode: { type: 'legacy' },
    },
    abandonedOn: 0,
    notifiedOn: 2,
  }

  const project = {
    ...defaultObj,
    ...overrides,
  }

  return {
    ...project,
    potentielIdentifier: 'potentielIdentifer',
  }
}
