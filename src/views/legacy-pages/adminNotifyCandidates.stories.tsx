import React from 'react'

import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeRequest from '../../__tests__/fixtures/request'
import makeFakeUser from '../../__tests__/fixtures/user'

import AdminNotifyCandidates from './adminNotifyCandidates'

// This is static
import { appelsOffreStatic } from '@dataAccess/inMemory'

export default { title: 'Notifier les candidats' }

const selectedAppelOffreId = appelsOffreStatic[0].id
const selectedPeriodeId = appelsOffreStatic[0].periodes[0].id

export const withError = () => (
  <AdminNotifyCandidates
    request={makeFakeRequest({ query: { error: 'This is an error message!' } })}
  />
)

export const withSuccess = () => (
  <AdminNotifyCandidates
    request={makeFakeRequest({
      query: { success: 'This is a success message!' },
    })}
  />
)

export const withProjects = () => (
  <AdminNotifyCandidates
    request={makeFakeRequest()}
    results={{
      selectedAppelOffreId: selectedAppelOffreId,
      projectsInPeriodCount: 3,
      existingAppelsOffres: [
        {
          id: appelsOffreStatic[0].id,
          shortTitle: appelsOffreStatic[0].shortTitle,
        },
      ],
      selectedPeriodeId: selectedPeriodeId,
      projects: {
        itemCount: 3,
        pagination: {
          page: 0,
          pageSize: 10,
        },
        pageCount: 1,
        items: [
          makeFakeProject({}),
          makeFakeProject({
            classe: 'Classé',
          }),
          makeFakeProject({
            classe: 'Classé',
          }),
        ],
      },
    }}
  />
)

export const withoutProjects = () => <AdminNotifyCandidates request={makeFakeRequest()} />
