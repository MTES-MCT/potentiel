import { Project } from '../../../entities';
import { LegacyModificationStatus } from '../../modificationRequest';
import { Fournisseur } from '../../project';
import { AppelOffre } from '@potentiel-domain/appel-offre';

export type ProjectEventDTO =
  | ProjectNotifiedDTO
  | ProjectImportedDTO
  | ProjectClaimedDTO
  | ProjectNotificationDateSetDTO
  | ProjectCompletionDueDateSetDTO
  | ModificationRequestedDTO
  | ModificationRequestAcceptedDTO
  | ModificationRequestCancelledDTO
  | ModificationRequestRejectedDTO
  | ModificationRequestInstructionStartedDTO
  | ModificationReceivedDTO
  | LegacyModificationImportedDTO
  | FileAttachedToProjectDTO
  | LegacyModificationFileAttachedDTO
  | CovidDelayGrantedDTO
  | DemandeDelaiSignaledDTO
  | DemandeAbandonSignaledDTO
  | DemandeDélaiDTO
  | CahierDesChargesChoisiDTO
  | AchèvementRéelDTO;

type File = {
  id: string;
  name: string;
};

export type ProjectStatus = 'Classé' | 'Eliminé' | 'Abandonné';

type NarrowDTOType<T, N> = T extends { type: N } ? T : never;

export const is =
  <T extends ProjectEventDTO, K extends T['type']>(type: K) =>
  (event: ProjectEventDTO): event is NarrowDTOType<T, K> =>
    event.type === type;

export type ProjectNotifiedDTO = {
  type: 'ProjectNotified';
  variant:
    | 'admin'
    | 'porteur-projet'
    | 'dreal'
    | 'acheteur-obligé'
    | 'dgec-validateur'
    | 'cre'
    | 'caisse-des-dépôts';
  date: number;
  isLegacy?: true;
};

export type ProjectImportedDTO = {
  type: 'ProjectImported';
  variant: 'dgec-validateur' | 'admin';
  date: number;
};

export type ProjectNotificationDateSetDTO = {
  type: 'ProjectNotificationDateSet';
  variant:
    | 'admin'
    | 'porteur-projet'
    | 'dreal'
    | 'acheteur-obligé'
    | 'dgec-validateur'
    | 'cre'
    | 'caisse-des-dépôts';
  date: number;
};

type ProjectCertificateBase = {
  date: number;
  potentielIdentifier: string;
  certificateFileId: string;
  nomProjet: string;
} & (
  | { variant: 'admin' | 'dgec-validateur'; email: string }
  | {
      variant: 'porteur-projet' | 'acheteur-obligé' | 'dreal' | 'cre';
      email: undefined;
    }
);

export type ProjectClaimedDTO = ProjectCertificateBase & {
  type: 'ProjectClaimed';
  claimedBy: string;
};

export type ProjectCertificateDTO = ProjectClaimedDTO;

export type ProjectCompletionDueDateSetDTO = {
  type: 'ProjectCompletionDueDateSet';
  date: number;
  variant:
    | 'admin'
    | 'porteur-projet'
    | 'dreal'
    | 'acheteur-obligé'
    | 'dgec-validateur'
    | 'cre'
    | 'caisse-des-dépôts';
  délaiCDC2022Appliqué?: true;
  délaiCDC2022Annulé?: true;
};

export type ModificationRequestedDTO = {
  type: 'ModificationRequested';
  date: number;
  variant:
    | 'admin'
    | 'porteur-projet'
    | 'dreal'
    | 'acheteur-obligé'
    | 'dgec-validateur'
    | 'caisse-des-dépôts'
    | 'cre';
  modificationRequestId: string;
  authority: 'dgec' | 'dreal';
} & (
  | {
      modificationType: 'delai';
      delayInMonths: number;
    }
  | {
      modificationType: 'puissance';
      puissance: number;
      unitePuissance?: string;
    }
);

export type ModificationRequestAcceptedDTO = {
  type: 'ModificationRequestAccepted';
  date: number;
  variant:
    | 'admin'
    | 'porteur-projet'
    | 'dreal'
    | 'acheteur-obligé'
    | 'dgec-validateur'
    | 'caisse-des-dépôts'
    | 'cre';
  modificationRequestId: string;
  file?: File;
  delayInMonthsGranted?: number;
};

export type ModificationRequestRejectedDTO = {
  type: 'ModificationRequestRejected';
  date: number;
  variant:
    | 'admin'
    | 'porteur-projet'
    | 'dreal'
    | 'acheteur-obligé'
    | 'dgec-validateur'
    | 'caisse-des-dépôts'
    | 'cre';
  modificationRequestId: string;
  file?: File;
};

export type ModificationRequestInstructionStartedDTO = {
  type: 'ModificationRequestInstructionStarted';
  date: number;
  variant:
    | 'admin'
    | 'porteur-projet'
    | 'dreal'
    | 'acheteur-obligé'
    | 'dgec-validateur'
    | 'caisse-des-dépôts'
    | 'cre';
  modificationRequestId: string;
};

export type ModificationRequestCancelledDTO = {
  type: 'ModificationRequestCancelled';
  date: number;
  variant:
    | 'admin'
    | 'porteur-projet'
    | 'dreal'
    | 'acheteur-obligé'
    | 'dgec-validateur'
    | 'caisse-des-dépôts'
    | 'cre';
  modificationRequestId: string;
};

export type ModificationRequestDTO =
  | ModificationRequestedDTO
  | ModificationRequestAcceptedDTO
  | ModificationRequestRejectedDTO
  | ModificationRequestInstructionStartedDTO
  | ModificationRequestCancelledDTO;

export type ModificationReceivedDTO = {
  type: 'ModificationReceived';
  date: number;
  variant:
    | 'admin'
    | 'porteur-projet'
    | 'dreal'
    | 'acheteur-obligé'
    | 'dgec-validateur'
    | 'caisse-des-dépôts'
    | 'cre';
  modificationRequestId: string;
} & (
  | { modificationType: 'actionnaire'; actionnaire: string }
  | { modificationType: 'producteur'; producteur: string }
  | { modificationType: 'fournisseur'; fournisseurs: Fournisseur[] }
  | { modificationType: 'puissance'; puissance: number; unitePuissance?: string }
);

export type LegacyModificationImportedDTO = {
  type: 'LegacyModificationImported';
  date: number;
  variant:
    | 'admin'
    | 'porteur-projet'
    | 'dreal'
    | 'acheteur-obligé'
    | 'dgec-validateur'
    | 'caisse-des-dépôts'
    | 'cre';
  status: LegacyModificationStatus;
  filename?: string;
} & (
  | {
      modificationType: 'delai';
      status: Extract<LegacyModificationStatus, 'acceptée'>;
      ancienneDateLimiteAchevement: number;
      nouvelleDateLimiteAchevement: number;
    }
  | {
      modificationType: 'delai';
      status: Extract<LegacyModificationStatus, 'rejetée' | 'accord-de-principe'>;
    }
  | { modificationType: 'actionnaire'; actionnairePrecedent: string }
  | { modificationType: 'producteur'; producteurPrecedent: string }
  | { modificationType: 'autre'; column: string; value: string }
);

export type LegacyModificationFileAttachedDTO = {
  type: 'LegacyModificationFileAttached';
  variant:
    | 'admin'
    | 'porteur-projet'
    | 'dreal'
    | 'acheteur-obligé'
    | 'dgec-validateur'
    | 'caisse-des-dépôts'
    | 'cre';
  file: File;
};

export type FileAttachedToProjectDTO = {
  type: 'FileAttachedToProject';
  variant: 'admin' | 'porteur-projet' | 'dreal' | 'dgec-validateur';
  date: number;
  title: string;
  description?: string;
  files: File[];
  isOwner: boolean;
  attachmentId: string;
  projectId: string;
  attachedBy: {
    id: string;
    name?: string;
    administration?: string;
  };
};

export type CovidDelayGrantedDTO = {
  type: 'CovidDelayGranted';
  date: number;
  variant:
    | 'admin'
    | 'porteur-projet'
    | 'dreal'
    | 'acheteur-obligé'
    | 'dgec-validateur'
    | 'caisse-des-dépôts'
    | 'cre';
};

export type DemandeDelaiSignaledDTO = {
  type: 'DemandeDelaiSignaled';
  variant:
    | 'admin'
    | 'porteur-projet'
    | 'dreal'
    | 'acheteur-obligé'
    | 'dgec-validateur'
    | 'caisse-des-dépôts'
    | 'cre';
  date: number;
  signaledBy: string;
  attachment?: File;
  notes?: string;
} & (
  | {
      status: 'acceptée';
      oldCompletionDueOn?: number;
      newCompletionDueOn: number;
    }
  | {
      status: 'rejetée' | 'accord-de-principe';
    }
);

export type DemandeAbandonSignaledDTO = {
  type: 'DemandeAbandonSignaled';
  variant:
    | 'admin'
    | 'porteur-projet'
    | 'dreal'
    | 'acheteur-obligé'
    | 'dgec-validateur'
    | 'caisse-des-dépôts'
    | 'cre';
  date: number;
  signaledBy: string;
  status: 'acceptée' | 'rejetée';
  attachment?: File;
  notes?: string;
};

export type DemandeDélaiDTO = {
  type: 'DemandeDélai';
  variant:
    | 'admin'
    | 'porteur-projet'
    | 'dreal'
    | 'acheteur-obligé'
    | 'dgec-validateur'
    | 'caisse-des-dépôts'
    | 'cre';
  date: number;
  demandeUrl?: string;
  actionRequise?: 'à traiter' | 'réponse à envoyer';
} & (
  | ({ dateAchèvementDemandée: string; délaiEnMoisDemandé?: undefined } & (
      | { statut: 'envoyée' | 'annulée' | 'rejetée' | 'en-instruction' }
      | {
          statut: 'accordée';
          dateAchèvementAccordée: string;
          ancienneDateThéoriqueAchèvement: string;
        }
    ))
  | ({ dateAchèvementDemandée?: undefined; délaiEnMoisDemandé: number } & (
      | { statut: 'envoyée' | 'annulée' | 'rejetée' | 'en-instruction' }
      | {
          statut: 'accordée';
          délaiEnMoisAccordé: number;
        }
    ))
  | {
      statut: 'accordée-corrigée';
      dateAchèvementAccordée: string;
    }
);

export type CahierDesChargesChoisiDTO = {
  type: 'CahierDesChargesChoisi';
  variant:
    | 'admin'
    | 'porteur-projet'
    | 'dreal'
    | 'acheteur-obligé'
    | 'dgec-validateur'
    | 'caisse-des-dépôts'
    | 'cre';
  date: number;
} & (
  | {
      cahierDesCharges: 'initial';
    }
  | {
      cahierDesCharges: 'modifié';
      paruLe: AppelOffre.DateParutionCahierDesChargesModifié;
      alternatif?: true;
    }
);

export type AchèvementRéelDTO = {
  type: 'achevement-reel';
  date: number;
  attestation: string;
  preuveTransmissionAuCocontractant: string;
  identifiantProjet: string;
  permissionModifier: boolean;
};

export type ProjectEventListDTO = {
  project: {
    id: Project['id'];
    status: ProjectStatus;
    garantieFinanciereEnMois?: number;
    nomProjet: string;
  };
  events: ProjectEventDTO[];
};
