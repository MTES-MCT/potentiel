import { ProjectAppelOffre } from '@entities'
import React from 'react'
import { batimentPPE2 } from 'src/dataAccess/inMemory/appelsOffres'

import makeFakeRequest from '../../../__tests__/fixtures/request'
import makeFakeUser from '../../../__tests__/fixtures/user'

import { ModificationRequest } from './ModificationRequest'

export default { title: 'Modification Request Details' }

export const RecoursOuvertPourAdmin = () => (
  <ModificationRequest
    request={makeFakeRequest({ user: makeFakeUser({ role: 'admin' }) })}
    modificationRequest={{
      id: 'modificationRequest123',
      status: 'envoyée',
      versionDate: 7376362,
      type: 'recours',
      requestedOn: 7376362,
      requestedBy: 'John Doe',
      justification: 'Ceci est la justification de ma demande de recours',
      attachmentFile: {
        filename: 'attachment.pdf',
        id: 'file123',
      },
      project: {
        id: 'projectId',
        potentielIdentifier: 'potentielIdentifier',
        numeroCRE: 'CRE123',
        nomProjet: 'Project ABC',
        nomCandidat: 'Mr John Doe',
        communeProjet: 'Commune',
        departementProjet: 'Departement',
        regionProjet: 'Région',
        puissance: 123,
        unitePuissance: 'kWc',
        notifiedOn: 7376362,
        appelOffreId: 'CRE4 - Nucléaire',
        periodeId: '10',
        familleId: '1C',
        numeroGestionnaire: 'GEFAR-P-1234',
        actionnaire: 'Mr Actionnaire',
        completionDueOn: 7376362,
        puissanceInitiale: 123,
        technologie: 'pv',
      },
    }}
  />
)

export const RecoursAccepté = () => (
  <ModificationRequest
    request={makeFakeRequest({ user: makeFakeUser({ role: 'admin' }) })}
    modificationRequest={{
      id: 'modificationRequest123',
      status: 'acceptée',
      respondedBy: 'Admin Doe',
      respondedOn: 7376362,
      versionDate: 7376362,
      type: 'recours',
      requestedOn: 7376362,
      requestedBy: 'John Doe',
      justification: 'Ceci est la justification de ma demande de recours',
      attachmentFile: {
        filename: 'attachment.pdf',
        id: 'file123',
      },
      project: {
        id: 'projectId',
        potentielIdentifier: 'potentielIdentifier',
        numeroCRE: 'CRE123',
        nomProjet: 'Project ABC',
        nomCandidat: 'Mr John Doe',
        communeProjet: 'Commune',
        departementProjet: 'Departement',
        regionProjet: 'Région',
        puissance: 123,
        unitePuissance: 'kWc',
        notifiedOn: 7376362,
        appelOffreId: 'CRE4 - Nucléaire',
        periodeId: '10',
        familleId: '1C',
        numeroGestionnaire: 'GEFAR-P-1234',
        actionnaire: 'Mr Actionnaire',
        completionDueOn: 7376362,
        puissanceInitiale: 123,
        technologie: 'pv',
      },
    }}
  />
)

export const RecoursRejeté = () => (
  <ModificationRequest
    request={makeFakeRequest({ user: makeFakeUser({ role: 'admin' }) })}
    modificationRequest={{
      id: 'modificationRequest123',
      status: 'rejetée',
      respondedBy: 'Admin Doe',
      respondedOn: 354354,
      versionDate: 354543535,
      type: 'recours',
      requestedOn: 545354354,
      requestedBy: 'John Doe',
      justification: 'Ceci est la justification de ma demande de recours',
      attachmentFile: {
        filename: 'attachment.pdf',
        id: 'file123',
      },
      project: {
        id: 'projectId',
        potentielIdentifier: 'potentielIdentifier',
        numeroCRE: 'CRE123',
        nomProjet: 'Project ABC',
        nomCandidat: 'Mr John Doe',
        communeProjet: 'Commune',
        departementProjet: 'Departement',
        regionProjet: 'Région',
        puissance: 123,
        unitePuissance: 'kWc',
        notifiedOn: 456,
        appelOffreId: 'CRE4 - Nucléaire',
        periodeId: '10',
        familleId: '1C',
        numeroGestionnaire: 'GEFAR-P-1234',
        actionnaire: 'Mr Actionnaire',
        completionDueOn: 123,
        puissanceInitiale: 123,
        technologie: 'pv',
      },
    }}
  />
)

export const ChangementPuissance = () => (
  <ModificationRequest
    request={makeFakeRequest({ user: makeFakeUser({ role: 'admin' }) })}
    modificationRequest={{
      type: 'puissance',
      puissance: 124,
      id: 'modificationRequest123',
      status: 'envoyée',
      versionDate: 7376362,
      requestedOn: 7376362,
      requestedBy: 'John Doe',
      justification: 'Ceci est la justification de ma demande de recours',
      attachmentFile: {
        filename: 'attachment.pdf',
        id: 'file123',
      },
      project: {
        id: 'projectId',
        potentielIdentifier: 'potentielIdentifier',
        numeroCRE: 'CRE123',
        nomProjet: 'Project ABC',
        nomCandidat: 'Mr John Doe',
        communeProjet: 'Commune',
        departementProjet: 'Departement',
        regionProjet: 'Région',
        puissance: 123,
        unitePuissance: 'kWc',
        notifiedOn: 7376362,
        appelOffreId: 'CRE4 - Nucléaire',
        periodeId: '10',
        familleId: '1C',
        numeroGestionnaire: 'GEFAR-P-1234',
        actionnaire: 'Mr Actionnaire',
        completionDueOn: 7376362,
        puissanceInitiale: 123,
        technologie: 'pv',
      },
    }}
  />
)

export const ChangementPuissanceNonAutoAccepteSuperieurVolumeReserve = () => (
  <ModificationRequest
    request={makeFakeRequest({ user: makeFakeUser({ role: 'admin' }) })}
    modificationRequest={{
      type: 'puissance',
      puissance: 2,
      id: 'modificationRequest123',
      status: 'envoyée',
      versionDate: 7376362,
      requestedOn: 7376362,
      requestedBy: 'John Doe',
      justification: 'Ceci est la justification de ma demande de recours',
      attachmentFile: {
        filename: 'attachment.pdf',
        id: 'file123',
      },
      project: {
        id: 'projectId',
        potentielIdentifier: 'potentielIdentifier',
        numeroCRE: 'CRE123',
        nomProjet: 'Project ABC',
        nomCandidat: 'Mr John Doe',
        communeProjet: 'Commune',
        departementProjet: 'Departement',
        regionProjet: 'Région',
        puissance: 0.5,
        unitePuissance: 'kWc',
        notifiedOn: 7376362,
        appelOffreId: 'CRE4 - Nucléaire',
        periodeId: '10',
        familleId: '1C',
        numeroGestionnaire: 'GEFAR-P-1234',
        actionnaire: 'Mr Actionnaire',
        completionDueOn: 7376362,
        puissanceInitiale: 0.5,
        technologie: 'pv',
        appelOffre: { ...batimentPPE2, periode: batimentPPE2.periodes[0] } as ProjectAppelOffre,
      },
    }}
  />
)
