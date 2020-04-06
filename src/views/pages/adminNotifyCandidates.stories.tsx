import React from 'react'

import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeCandidateNotification from '../../__tests__/fixtures/candidateNotification'
import makeFakeRequest from '../../__tests__/fixtures/request'
import makeFakeUser from '../../__tests__/fixtures/user'

import AdminNotifyCandidates from './adminNotifyCandidates'

// This is static
import { appelsOffreStatic } from '../../dataAccess/inMemory/appelOffre'

export default { title: 'Notifier les candidats' }

const selectedAppelOffreId = appelsOffreStatic[0].id
const selectedPeriodeId = appelsOffreStatic[0].periodes[0].id

export const withError = () => (
  <AdminNotifyCandidates
    appelsOffre={appelsOffreStatic}
    selectedAppelOffreId={selectedAppelOffreId}
    selectedPeriodeId={selectedPeriodeId}
    request={makeFakeRequest({ query: { error: 'This is an error message!' } })}
  />
)

export const withSuccess = () => (
  <AdminNotifyCandidates
    appelsOffre={appelsOffreStatic}
    selectedAppelOffreId={selectedAppelOffreId}
    selectedPeriodeId={selectedPeriodeId}
    request={makeFakeRequest({
      query: { success: 'This is a success message!' }
    })}
  />
)

export const withProjects = () => (
  <AdminNotifyCandidates
    appelsOffre={appelsOffreStatic}
    selectedAppelOffreId={selectedAppelOffreId}
    selectedPeriodeId={selectedPeriodeId}
    request={makeFakeRequest()}
    projects={[
      makeFakeProject({
        candidateNotifications: [
          makeFakeCandidateNotification({ template: 'elimination' })
        ]
      }),
      makeFakeProject({
        classe: 'Classé',
        candidateNotifications: [makeFakeCandidateNotification()]
      }),
      makeFakeProject({
        classe: 'Classé'
      })
    ]}
  />
)
