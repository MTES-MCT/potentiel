import React from 'react'

import makeFakeRequest from '../../../__tests__/fixtures/request'
import makeFakeUser from '../../../__tests__/fixtures/user'

import AdminModificationRequestPage from './'

export default { title: 'Modification Request Details' }

export const RecoursOuvertPourAdmin = () => (
  <AdminModificationRequestPage
    request={makeFakeRequest({ user: makeFakeUser({ role: 'admin' }) })}
    modificationRequest={{
      id: 'modificationRequest123',
      status: 'envoyée',
      versionDate: new Date(),
      type: 'recours',
      requestedOn: new Date(),
      requestedBy: 'John Doe',
      justification: 'Ceci est la justification de ma demande de recours',
      attachmentFile: {
        filename: 'attachment.pdf',
        id: 'file123',
      },
      project: {
        id: 'projectId',
        numeroCRE: 'CRE123',
        nomProjet: 'Project ABC',
        nomCandidat: 'Mr John Doe',
        communeProjet: 'Commune',
        departementProjet: 'Departement',
        regionProjet: 'Région',
        puissance: 123,
        unitePuissance: 'kWc',
        notifiedOn: new Date(),
        appelOffreId: 'CRE4 - Nucléaire',
        periodeId: '10',
        familleId: '1C',
      },
    }}
  />
)

export const RecoursAccepté = () => (
  <AdminModificationRequestPage
    request={makeFakeRequest({ user: makeFakeUser({ role: 'admin' }) })}
    modificationRequest={{
      id: 'modificationRequest123',
      status: 'acceptée',
      respondedBy: 'Admin Doe',
      respondedOn: new Date(),
      versionDate: new Date(),
      type: 'recours',
      requestedOn: new Date(),
      requestedBy: 'John Doe',
      justification: 'Ceci est la justification de ma demande de recours',
      attachmentFile: {
        filename: 'attachment.pdf',
        id: 'file123',
      },
      project: {
        id: 'projectId',
        numeroCRE: 'CRE123',
        nomProjet: 'Project ABC',
        nomCandidat: 'Mr John Doe',
        communeProjet: 'Commune',
        departementProjet: 'Departement',
        regionProjet: 'Région',
        puissance: 123,
        unitePuissance: 'kWc',
        notifiedOn: new Date(),
        appelOffreId: 'CRE4 - Nucléaire',
        periodeId: '10',
        familleId: '1C',
      },
    }}
  />
)

export const RecoursRejeté = () => (
  <AdminModificationRequestPage
    request={makeFakeRequest({ user: makeFakeUser({ role: 'admin' }) })}
    modificationRequest={{
      id: 'modificationRequest123',
      status: 'rejetée',
      respondedBy: 'Admin Doe',
      respondedOn: new Date(),
      versionDate: new Date(),
      type: 'recours',
      requestedOn: new Date(),
      requestedBy: 'John Doe',
      justification: 'Ceci est la justification de ma demande de recours',
      attachmentFile: {
        filename: 'attachment.pdf',
        id: 'file123',
      },
      project: {
        id: 'projectId',
        numeroCRE: 'CRE123',
        nomProjet: 'Project ABC',
        nomCandidat: 'Mr John Doe',
        communeProjet: 'Commune',
        departementProjet: 'Departement',
        regionProjet: 'Région',
        puissance: 123,
        unitePuissance: 'kWc',
        notifiedOn: new Date(),
        appelOffreId: 'CRE4 - Nucléaire',
        periodeId: '10',
        familleId: '1C',
      },
    }}
  />
)
