import React from 'react';
import {
  ProjectImportedDTO,
  ProjectNotifiedDTO,
  ProjectCertificateGeneratedDTO,
  ProjectClaimedDTO,
  ProjectNotificationDateSetDTO,
  ModificationRequestedDTO,
  ModificationRequestAcceptedDTO,
  ModificationRequestRejectedDTO,
  ModificationReceivedDTO,
  LegacyModificationImportedDTO,
  ProjectEventListDTO,
  LegacyModificationFileAttachedDTO,
  CovidDelayGrantedDTO,
  ProjectCompletionDueDateSetDTO,
  DemandeAbandonDTO,
  GarantiesFinancièresDTO,
} from '@modules/frise';
import { Timeline } from './Timeline';

export default { title: 'Nouvelle frise' };

const project = {
  id: 'fake-project-id',
  status: 'Classé',
  isSoumisAuxGF: true,
  isGarantiesFinancieresDeposeesALaCandidature: false,
  nomProjet: 'monProjet',
} as ProjectEventListDTO['project'];

export const adminGarantiesFinancieresDues = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectImported',
          variant: 'admin',
          date: new Date('2022-01-11').getTime(),
        } as ProjectImportedDTO,
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'admin',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: 'porteur@test.test',
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'garanties-financières',
          variant: 'admin',
          date: new Date('2022-01-13').getTime(),
          statut: 'en attente',
        } as GarantiesFinancièresDTO,
      ],
    }}
    now={new Date().getTime()}
  />
);

export const PPGarantiesFinancieresDues = () => (
  <Timeline
    projectEventList={{
      project: { ...project, garantieFinanciereEnMois: 42 },
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'garanties-financières',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
          statut: 'en attente',
        } as GarantiesFinancièresDTO,
      ],
    }}
    now={new Date().getTime()}
  />
);

export const PPGarantiesFinancieresEnRetard = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-01').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'garanties-financières',
          variant: 'porteur-projet',
          date: new Date('2019-01-13').getTime(),
          statut: 'en attente',
        } as GarantiesFinancièresDTO,
      ],
    }}
    now={new Date('2022-01-12').getTime()}
  />
);

export const PPGarantiesFinancieresEtDCREnRetard = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-01').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'garanties-financières',
          variant: 'porteur-projet',
          date: new Date('2019-01-13').getTime(),
          statut: 'en attente',
        } as GarantiesFinancièresDTO,
      ],
    }}
    now={new Date('2022-02-12').getTime()}
  />
);

export const garantiesFinancieresConstituees = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectImported',
          variant: 'admin',
          date: new Date('2022-01-11').getTime(),
        } as ProjectImportedDTO,
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'admin',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: 'porteur@test.test',
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ProjectClaimed',
          variant: 'admin',
          date: new Date('2022-01-14').getTime(),
          potentielIdentifier: 'pot-id',
          certificateFileId: 'file-id',
          nomProjet: 'nom-projet',
          email: 'email',
          claimedBy: 'someone',
        } as ProjectClaimedDTO,
        {
          type: 'garanties-financières',
          variant: 'admin',
          date: new Date('2019-01-13').getTime(),
          statut: 'à traiter',
          envoyéesPar: 'porteur-projet',
          url: 'url-fichier',
        } as GarantiesFinancièresDTO,
      ],
    }}
    now={new Date().getTime()}
  />
);

export const garantiesFinancieresValidées = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectImported',
          variant: 'admin',
          date: new Date('2022-01-11').getTime(),
        } as ProjectImportedDTO,
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'admin',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: 'porteur@test.test',
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ProjectClaimed',
          variant: 'admin',
          date: new Date('2022-01-14').getTime(),
          potentielIdentifier: 'pot-id',
          certificateFileId: 'file-id',
          nomProjet: 'nom-projet',
          email: 'email',
          claimedBy: 'someone',
        } as ProjectClaimedDTO,
        {
          type: 'garanties-financières',
          variant: 'admin',
          date: new Date('2019-01-13').getTime(),
          statut: 'validé',
          envoyéesPar: 'porteur-projet',
          url: 'url-fichier',
        } as GarantiesFinancièresDTO,
      ],
    }}
    now={new Date().getTime()}
  />
);

export const projetHistorique = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: new Date('2022-01-12').getTime(),
          isLegacy: true,
        } as ProjectNotifiedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
);

export const PPAttestationEnCoursDeGeneration = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
);

export const AdminAttestationEnCoursDeGeneration = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
);

export const projetEliminé = () => (
  <Timeline
    projectEventList={{
      project: { ...project, status: 'Eliminé' },
      events: [
        {
          type: 'ProjectImported',
          variant: 'admin',
          date: new Date('2022-01-11').getTime(),
        } as ProjectImportedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
);

export const RecoursAccepte = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectNotificationDateSet',
          variant: 'admin',
          date: new Date('2022-01-20').getTime(),
        } as ProjectNotificationDateSetDTO,
      ],
    }}
    now={new Date().getTime()}
  />
);

export const PuissanceRequestedForPP = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'admin',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: 'porteur@test.test',
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ModificationRequested',
          date: new Date('2022-01-14').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: 'id-1',
          authority: 'dreal',
          modificationType: 'puissance',
          puissance: 100,
          unitePuissance: 'MW',
        } as ModificationRequestedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
);

export const DelayRequestedForPP = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'admin',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: 'porteur@test.test',
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ModificationRequested',
          date: new Date('2022-01-14').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: 'id-1',
          authority: 'dreal',
          modificationType: 'delai',
          delayInMonths: 2,
        } as ModificationRequestedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
);

export const DelayRequestedInstructionStartedForPP = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ModificationRequested',
          date: new Date('2022-01-14').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: 'id-1',
          authority: 'dreal',
          modificationType: 'delai',
          delayInMonths: 2,
        } as ModificationRequestedDTO,
        {
          type: 'ModificationRequestInstructionStarted',
          date: new Date('2022-01-15').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: 'id-1',
        },
      ],
    }}
    now={new Date().getTime()}
  />
);

export const DelayAcceptedForPP = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ModificationRequested',
          date: new Date('2022-01-14').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: 'id-1',
          authority: 'dreal',
          modificationType: 'delai',
          delayInMonths: 2,
        } as ModificationRequestedDTO,
        {
          type: 'ModificationRequestAccepted',
          date: new Date('2022-01-14').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: 'id-1',
        } as ModificationRequestAcceptedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
);

export const RecoursRejectedForPP = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ModificationRequested',
          date: new Date('2022-01-14').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: 'id-1',
          authority: 'dgec',
          modificationType: 'recours',
        } as ModificationRequestedDTO,
        {
          type: 'ModificationRequestRejected',
          date: new Date('2022-01-14').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: 'id-1',
          file: { id: 'id', name: 'name' },
        } as ModificationRequestRejectedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
);

export const DelayRequestedForDreal = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'dreal',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ModificationRequested',
          date: new Date('2022-01-14').getTime(),
          variant: 'dreal',
          modificationRequestId: 'id-1',
          authority: 'dreal',
          modificationType: 'delai',
          delayInMonths: 2,
        } as ModificationRequestedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
);

export const DelayRequestedInstructionStartedForDreal = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'dreal',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ModificationRequested',
          date: new Date('2022-01-14').getTime(),
          variant: 'dreal',
          modificationRequestId: 'id-1',
          authority: 'dreal',
          modificationType: 'delai',
          delayInMonths: 2,
        } as ModificationRequestedDTO,
        {
          type: 'ModificationRequestInstructionStarted',
          date: new Date('2022-01-15').getTime(),
          variant: 'dreal',
          modificationRequestId: 'id-1',
        },
      ],
    }}
    now={new Date().getTime()}
  />
);

export const RecoursRequestedForADMIN = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ModificationRequested',
          date: new Date('2022-01-14').getTime(),
          variant: 'admin',
          modificationRequestId: 'id-1',
          authority: 'dgec',
          modificationType: 'recours',
        } as ModificationRequestedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
);

export const PPModificationReceived = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'ModificationReceived',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
          modificationType: 'actionnaire',
          actionnaire: 'nomActionnaire',
        } as ModificationReceivedDTO,
        {
          type: 'ModificationReceived',
          variant: 'porteur-projet',
          date: new Date('2022-02-13').getTime(),
          modificationType: 'fournisseur',
          fournisseurs: [
            { kind: 'Nom du fabricant \n(Modules ou films)', name: 'name1' },
            { kind: 'Nom du fabricant \n(Polysilicium)', name: 'name2' },
          ],
        } as ModificationReceivedDTO,
        {
          type: 'ModificationReceived',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
          modificationType: 'puissance',
          puissance: 2,
          unitePuissance: 'MW',
        } as ModificationReceivedDTO,
        {
          type: 'ModificationReceived',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
          modificationType: 'producteur',
          producteur: 'nomProducteur',
        } as ModificationReceivedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
);

export const drealGarantiesFinancieresNotUploaded = () => (
  <Timeline
    projectEventList={{
      project: { ...project },
      events: [
        {
          type: 'ProjectNotified',
          variant: 'dreal',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
);

export const PPGarantiesFinancieresNotUploaded = () => (
  <Timeline
    projectEventList={{
      project: { ...project },
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
);

export const drealGarantiesFinancieresUploaded = () => (
  <Timeline
    projectEventList={{
      project: { ...project },
      events: [
        {
          type: 'ProjectNotified',
          variant: 'dreal',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'garanties-financières',
          variant: 'dreal',
          date: new Date('2019-01-13').getTime(),
          statut: 'à traiter',
          envoyéesPar: 'dreal',
          url: 'url-fichier',
        } as GarantiesFinancièresDTO,
      ],
    }}
    now={new Date().getTime()}
  />
);

export const PPGarantiesFinancieresUploaded = () => (
  <Timeline
    projectEventList={{
      project: { ...project },
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'garanties-financières',
          variant: 'porteur-projet',
          date: new Date('2019-01-13').getTime(),
          statut: 'validé',
          envoyéesPar: 'porteur-projet',
          url: 'url-fichier',
        } as GarantiesFinancièresDTO,
      ],
    }}
    now={new Date().getTime()}
  />
);

export const LegacyModificationsAndDelayRequestForPP = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2019-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2019-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'LegacyModificationImported',
          date: new Date('2019-01-15').getTime(),
          variant: 'porteur-projet',
          modificationType: 'delai',
          ancienneDateLimiteAchevement: new Date('2022-01-15').getTime(),
          nouvelleDateLimiteAchevement: new Date('2024-01-15').getTime(),
          status: 'acceptée',
          filename: 'fichier.pdf',
        } as LegacyModificationImportedDTO,
        {
          type: 'LegacyModificationFileAttached',
          date: new Date('2019-01-15').getTime(),
          variant: 'porteur-projet',
          file: {
            id: '123',
            name: 'fichier.pdf',
          },
        } as LegacyModificationFileAttachedDTO,
        {
          type: 'LegacyModificationImported',
          date: new Date('2019-01-16').getTime(),
          variant: 'porteur-projet',
          modificationType: 'producteur',
          producteurPrecedent: 'ancien producteur',
          status: 'accord-de-principe',
        } as LegacyModificationImportedDTO,
        {
          type: 'LegacyModificationImported',
          date: new Date('2019-01-16').getTime(),
          variant: 'porteur-projet',
          modificationType: 'autre',
          column: 'Puissance installé du projet indiquée au B. du formulaire de candidature (MWc)',
          value: '24',
          status: 'acceptée',
        } as LegacyModificationImportedDTO,
        {
          type: 'ModificationRequested',
          date: new Date('2022-01-14').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: 'id-1',
          authority: 'dreal',
          modificationType: 'delai',
          delayInMonths: 2,
        } as ModificationRequestedDTO,
        {
          type: 'ModificationRequestAccepted',
          date: new Date('2022-01-14').getTime(),
          variant: 'porteur-projet',
          modificationRequestId: 'id-1',
        } as ModificationRequestAcceptedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
);

export const LegacyRecoursRejectedForPP = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2019-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2019-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'LegacyModificationImported',
          date: new Date('2019-01-15').getTime(),
          variant: 'porteur-projet',
          modificationType: 'recours',
          status: 'rejetée',
          motifElimination: 'documents manquants',
        } as LegacyModificationImportedDTO,
      ],
    }}
    now={new Date().getTime()}
  />
);

export const AdminFichierAttache = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: new Date('2019-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'FileAttachedToProject',
          variant: 'admin',
          date: new Date('2022-02-01').getTime(),
          files: [
            {
              id: '1234',
              name: 'Fichier 1.pdf',
            },
            {
              id: '1234',
              name: 'Fichier 2.pdf',
            },
            {
              id: '1234',
              name: 'Fichier 3.pdf',
            },
          ],
          title: 'Action en justice',
          isOwner: true,
          projectId: project.id,
          attachmentId: '123',
          attachedBy: {
            id: '123',
            name: 'Bernard Thierry',
            administration: 'DREAL PACA',
          },
        },
        {
          type: 'FileAttachedToProject',
          variant: 'admin',
          title: 'Evenement avec description',
          description:
            'Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa.',
          date: new Date('2022-02-10').getTime(),
          files: [
            {
              id: '1234',
              name: 'Fichier 1.pdf',
            },
          ],
          isOwner: false,
          projectId: project.id,
          attachmentId: '124',
          attachedBy: {
            id: '123',
          },
        },
      ],
    }}
    now={new Date().getTime()}
  />
);

export const AdminDélaiCovid = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectImported',
          variant: 'admin',
          date: new Date('2022-01-11').getTime(),
        } as ProjectImportedDTO,
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: new Date('2022-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'admin',
          date: new Date('2022-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: 'porteur@test.test',
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'CovidDelayGranted',
          variant: 'admin',
          date: new Date('2022-02-13').getTime(),
        } as CovidDelayGrantedDTO,
        {
          type: 'ProjectCompletionDueDateSet',
          variant: 'admin',
          date: new Date('2022-02-13').getTime(),
        } as ProjectCompletionDueDateSetDTO,
      ],
    }}
    now={new Date().getTime()}
  />
);

export const DemandeDelaiSignaléAcceptée = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2019-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2019-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'DemandeDelaiSignaled',
          variant: 'porteur-projet',
          status: 'acceptée',
          date: new Date('2019-01-16').getTime(),
          signaledBy: 'fakeuser-id',
          oldCompletionDueOn: new Date('2021-10-16').getTime(),
          newCompletionDueOn: new Date('2022-01-16').getTime(),
          attachment: { id: 'file-id', name: 'file-name' },
          notes:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam',
        },
      ],
    }}
    now={new Date().getTime()}
  />
);

export const DemandeDelaiSignaléRefusée = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2019-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2019-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'DemandeDelaiSignaled',
          variant: 'porteur-projet',
          status: 'rejetée',
          date: new Date('2019-01-16').getTime(),
          signaledBy: 'fakeuser-id',
          attachment: { id: 'file-id', name: 'file-name' },
          notes:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam',
        },
      ],
    }}
    now={new Date().getTime()}
  />
);

export const AbandonDemandéForAdmin = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'admin',
          date: new Date('2019-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'admin',
          date: new Date('2010-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: 'porteur@test.test',
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'DemandeAbandon',
          variant: 'admin',
          date: new Date('2019-01-20').getTime(),
          statut: 'envoyée',
          demandeUrl: 'demandeUrl',
          actionRequise: 'à traiter',
        } as DemandeAbandonDTO,
      ],
    }}
    now={new Date().getTime()}
  />
);

export const AbandonRejetéForPP = () => (
  <Timeline
    projectEventList={{
      project,
      events: [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2019-01-12').getTime(),
        } as ProjectNotifiedDTO,
        {
          type: 'ProjectCertificateGenerated',
          variant: 'porteur-projet',
          date: new Date('2019-01-13').getTime(),
          certificateFileId: 'file-id',
          nomProjet: 'mon projet pv',
          email: undefined,
          potentielIdentifier: 'pot-id',
        } as ProjectCertificateGeneratedDTO,
        {
          type: 'DemandeAbandon',
          variant: 'porteur-projet',
          date: new Date('2019-01-20').getTime(),
          statut: 'rejetée',
          demandeUrl: 'demandeUrl',
        } as DemandeAbandonDTO,
      ],
    }}
    now={new Date().getTime()}
  />
);
