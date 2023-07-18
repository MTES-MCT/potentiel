import React from 'react';

import makeFakeProject from '../../__tests__/fixtures/project';
import makeFakeRequest from '../../__tests__/fixtures/request';

// This is static
import { appelsOffreStatic } from '@dataAccess/inMemory';
import { AdminNotificationCandidats } from './AdminNotificationCandidatsPage';

export default { title: 'Notifier les candidats' };

const AOSélectionné = appelsOffreStatic[0].id;
const selectedPeriodeId = appelsOffreStatic[0].periodes[0].id;

export const withError = () => (
  <AdminNotificationCandidats
    request={makeFakeRequest({ query: { error: 'This is an error message!' } })}
    currentUrl="http://localhost:3000/admin/notifier-candidats.html"
  />
);

export const withSuccess = () => (
  <AdminNotificationCandidats
    request={makeFakeRequest({
      query: { success: 'This is a success message!' },
    })}
    currentUrl="http://localhost:3000/admin/notifier-candidats.html"
  />
);

export const withProjects = () => (
  <AdminNotificationCandidats
    request={makeFakeRequest()}
    données={{
      AOSélectionné,
      listeAOs: [appelsOffreStatic[0].id],
      périodeSélectionnée: selectedPeriodeId,
      projetsPériodeSélectionnée: {
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
    currentUrl="http://localhost:3000/admin/notifier-candidats.html"
  />
);

export const withoutProjects = () => (
  <AdminNotificationCandidats
    request={makeFakeRequest()}
    currentUrl="http://localhost:3000/admin/notifier-candidats.html"
  />
);
