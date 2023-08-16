import React from 'react';
import { ProjectAppelOffre } from '../../../entities';

import makeFakeProject from '../../../__tests__/fixtures/project';
import makeFakeRequest from '../../../__tests__/fixtures/request';

import { NewModificationRequest } from './NewModificationRequest';

export default { title: 'Modification Request' };

export const Fournisseur = () => (
  <NewModificationRequest
    {...{
      request: makeFakeRequest({ query: { action: 'fournisseur' } }),
      project: makeFakeProject(),
      appelOffre: {} as ProjectAppelOffre,
    }}
  />
);

export const Actionnaire = () => (
  <NewModificationRequest
    {...{
      request: makeFakeRequest({ query: { action: 'actionnaire' } }),
      project: makeFakeProject(),
      appelOffre: {} as ProjectAppelOffre,
    }}
  />
);

export const Recours = () => (
  <NewModificationRequest
    {...{
      request: makeFakeRequest({ query: { action: 'recours' } }),
      project: makeFakeProject(),
      appelOffre: {} as ProjectAppelOffre,
    }}
  />
);
