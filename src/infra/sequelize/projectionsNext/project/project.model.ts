import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import { Technologie } from '../../../../entities';
import { GarantiesFinancières } from '../garantiesFinancières/garantiesFinancières.model';
import { User } from '../users/users.model';
import { File } from '../file/file.model';

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
  dateMiseEnService?: Date;
  dateFileAttente?: Date;
  soumisAuxGF: boolean;
  garantiesFinancières?: NonAttribute<GarantiesFinancières>;
  users?: NonAttribute<User[]>;
  certificateFile?: NonAttribute<File>;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
}
