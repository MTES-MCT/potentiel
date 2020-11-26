import React from 'react'

import makeFakeRequest from '../../__tests__/fixtures/request'
import makeFakeUser from '../../__tests__/fixtures/user'

import AdminModificationRequestPage from './adminModificationRequest'

export default { title: 'Admin Modification Request' }

export const Recours = () => (
  <AdminModificationRequestPage
    request={makeFakeRequest({ user: makeFakeUser({ role: "admin"}) })}
    modificationRequest={{
      id: "modificationRequest123",
      versionDate: 1,
      type: "recours",
      requestedOn: new Date(),
      requestedBy: 'John Doe',
      justification: "Ceci est la justification de ma demande de recours",
      attachmentFile: {
        filename: "attachment.pdf",
        id: 'file123'
      },
      project: {
        id: 'projectId',
        numeroCRE: 'CRE123',
        nomProjet: "Project ABC",
        nomCandidat: "Mr John Doe",
        communeProjet: "Commune",
        departementProjet: "Departement",
        regionProjet: "Région",
        puissance: 123,
        unitePuissance: 'kWc',
        notifiedOn: new Date(),
        appelOffreId: "CRE4 - Nucléaire",
        periodeId: '10',
        familleId: '1C'
      }
    }}
  />
)