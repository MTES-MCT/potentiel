import { InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize';
import { Technologie } from '@entities';
import { ContratEDF } from '@modules/edf';
import { ContratEnedis } from '@modules/enedis';
import { GarantiesFinancières } from '../garantiesFinancières/garantiesFinancières.model';
import { Raccordements } from '../raccordements/raccordements.model';
import { makeSequelizeProjector } from '@infra/sequelize/helpers';

export class Project extends Model<InferAttributes<Project>, InferCreationAttributes<Project>> {
  id: string;
  appelOffreId: string;
  periodeId: string;
  numeroCRE: string;
  familleId: string;
  nomCandidat: string;
  nomProjet: string;
  puissanceInitiale: number;
  puissance: number;
  prixReference: number;
  evaluationCarbone: number;
  evaluationCarboneDeRéférence: number;
  note: number;
  nomRepresentantLegal: string;
  email: string;
  adresseProjet: string;
  codePostalProjet: string;
  communeProjet: string;
  departementProjet: string;
  territoireProjet?: string;
  regionProjet: string;
  classe: 'Classé' | 'Eliminé';
  fournisseur?: string;
  actionnaire?: string;
  motifsElimination?: string;
  isFinancementParticipatif: boolean;
  isInvestissementParticipatif: boolean;
  engagementFournitureDePuissanceAlaPointe: boolean;
  notifiedOn: number;
  dcrDueOn: number;
  completionDueOn: number;
  abandonedOn: number;
  details?: { [key: string]: string };
  certificateFileId?: string | null;
  cahierDesChargesActuel: string;
  potentielIdentifier: string;
  technologie?: Technologie;
  actionnariat: 'financement-collectif' | 'gouvernance-partagee' | '';
  contratEDF?: ContratEDF;
  contratEnedis?: ContratEnedis;
  dateMiseEnService?: Date;
  dateFileAttente?: Date;
  soumisAuxGF: boolean;
  garantiesFinancières?: NonAttribute<GarantiesFinancières>;
  raccordements?: NonAttribute<Raccordements>;
}

export const projectTableName = 'projects';

export const ProjectProjector = makeSequelizeProjector(Project, projectTableName);
