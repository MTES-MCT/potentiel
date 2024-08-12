import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { ResultAsync } from '../../../core/utils';
import { ProjectAppelOffre, User } from '../../../entities';
import { Permission } from '../../authN';
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared';
import { Actionnariat, DésignationCatégorie } from '../types';
import { TypeGarantiesFinancières } from '@potentiel-domain/common';

export const PermissionConsulterProjet: Permission = {
  nom: 'consulter-projet',
  description: 'Consulter un projet',
};

export type GetProjectDataForProjectPage = (args: {
  projectId: string;
  user: User;
}) => ResultAsync<ProjectDataForProjectPage, EntityNotFoundError | InfraNotAvailableError>;

export type ProjectDataForProjectPage = {
  dcrDueOn: number;
  id: string;
  potentielIdentifier: string;

  appelOffre: ProjectAppelOffre;

  appelOffreId: string;
  periodeId: string;
  familleId: string;
  numeroCRE: string;
  cahierDesChargesActuel: {
    url: string;
  } & (
    | {
        type: 'initial';
      }
    | {
        type: 'modifié';
        paruLe: string;
        alternatif?: true;
      }
  );

  isLegacy: boolean;

  puissance: number;
  prixReference?: number;

  engagementFournitureDePuissanceAlaPointe: boolean;
  isFinancementParticipatif: boolean;
  isInvestissementParticipatif: boolean;
  actionnariat?: Actionnariat;

  adresseProjet: string;
  codePostalProjet: string;
  communeProjet: string;
  departementProjet: string;
  regionProjet: string;
  territoireProjet?: string;

  nomCandidat: string;
  nomProjet: string;
  nomRepresentantLegal: string;
  email: string;
  fournisseur?: string;
  evaluationCarbone?: number;
  note: number;
  notesInnovation?: NotesInnovation;
  notePrix?: string;

  désignationCatégorie?: DésignationCatégorie;

  details: Record<string, any>;

  updatedAt?: Date;

  garantiesFinancières?: GarantiesFinancièresForProjectPage;
} & (IsNotified | IsNotNotified) &
  (IsClasse | IsElimine | IsAbandoned);

type IsNotNotified = {
  notifiedOn: undefined;
};

type IsNotified = {
  notifiedOn: number;
  certificateFile?: {
    id: string;
    filename: string;
  };
} & Users;

type IsClasse = {
  isClasse: true;
  isAbandoned: false;
  completionDueOn: Date;
};

type IsElimine = {
  isClasse: false;
  isAbandoned: false;
  motifsElimination: string;
};

type IsAbandoned = {
  isAbandoned: true;
  isClasse: false;
};

type Users = {
  users: Array<{
    id: string;
    fullName: string;
    email: string;
  }>;
};

type NotesInnovation = {
  note: string;
  degréInnovation: string;
  positionnement: string;
  qualitéTechnique: string;
  adéquationAmbitionsIndustrielles: string;
  aspectsEnvironnementauxEtSociaux: string;
};

export type GarantiesFinancièresForProjectPage = {
  garantiesFinancièresEnAttente?: {
    motif: GarantiesFinancières.MotifDemandeGarantiesFinancières.RawType;
  };
  actuelles?: {
    type?: TypeGarantiesFinancières.RawType;
    dateConstitution?: string;
    dateÉchéance?: string;
  };
  dépôtÀTraiter?: {
    type?: TypeGarantiesFinancières.RawType;
    dateConstitution: string;
    dateÉchéance?: string;
  };
};
