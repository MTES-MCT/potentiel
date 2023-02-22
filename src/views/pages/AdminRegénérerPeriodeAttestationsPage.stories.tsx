import React from 'react';
import makeFakeRequest from '../../__tests__/fixtures/request';
import { AdminRegénérerPeriodeAttestations } from './AdminRegénérerPeriodeAttestationsPage';

export default { title: 'Admin: Regénérer les attestations' };

export const empty = () => <AdminRegénérerPeriodeAttestations request={makeFakeRequest()} />;

export const withError = () => (
  <AdminRegénérerPeriodeAttestations
    request={makeFakeRequest({ query: { error: 'This is an error message!' } })}
  />
);

export const withSuccess = () => (
  <AdminRegénérerPeriodeAttestations
    request={makeFakeRequest({
      query: { success: 'This is a success message!' },
    })}
  />
);
