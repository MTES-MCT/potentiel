import { ResultAsync } from '@core/utils';
import { ProjectAppelOffre, User } from '@entities';
import { Permission } from '@modules/authN';
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared';

export const PermissionConsulterProjet: Permission = {
  nom: 'consulter-projet',
  description: 'Consulter un projet',
};

export type GetProjectDataForProjectPage = (args: {
  projectId: string;
  user: User;
}) => ResultAsync<ProjectDataForProjectPage, EntityNotFoundError | InfraNotAvailableError>;

export type ProjectDataForProjectPage = {
  alerteAnnulationAbandon?: AlerteAnnulationAbandon;
  id: string;
  potentielIdentifier: string;

  appelOffre: ProjectAppelOffre;
  gestionnaireDeRéseau?: GestionnaireDeRéseau;

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

  details: Record<string, any>;

  contratEDF?: Partial<{
    numero: string;
    type: string;
    dateEffet: string;
    dateSignature: string;
    dateMiseEnService: string;
    duree: number;
    statut: string;
  }>;

  contratEnedis?: {
    numero: string;
  };

  updatedAt?: Date;
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

type AlerteAnnulationAbandon =
  | {
      actionPossible: 'voir-demande-en-cours';
      urlDemandeEnCours: string;
    }
  | {
      actionPossible: 'choisir-nouveau-cdc';
      cdcAvecOptionAnnulationAbandon: Array<{
        type: 'modifié';
        paruLe: string;
        alternatif?: true;
      }>;
    }
  | {
      actionPossible: 'demander-annulation-abandon';
      dateLimite: string;
    };

type GestionnaireDeRéseau = {
  identifiantGestionnaire: string;
  codeEICGestionnaireRéseau?: string;
  raisonSocialeGestionnaireRéseau?: string;
};

type NotesInnovation = {
  note: string;
  degréInnovation: string;
  positionnement: string;
  qualitéTechnique: string;
  adéquationAmbitionsIndustrielles: string;
  aspectsEnvironnementauxEtSociaux: string;
};
