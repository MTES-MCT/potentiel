import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import { Project } from '../project/project.model';

export class ModificationRequest extends Model<
  InferAttributes<ModificationRequest>,
  InferCreationAttributes<ModificationRequest>
> {
  id: string;
  projectId: string;
  userId?: string;
  type: 'actionnaire' | 'fournisseur' | 'producteur' | 'puissance' | 'recours' | 'delai' | 'autre';
  status: string;
  requestedOn: number;
  versionDate: CreationOptional<Date>;
  respondedOn?: number | null;
  respondedBy?: string | null;
  responseFileId?: string | null;
  acceptanceParams?: { [key: string]: string | number } | null;
  authority?: 'dreal' | 'dgec';
  filename?: string;
  fileId?: string;
  justification?: string;
  actionnaire?: string;
  producteur?: string;
  fournisseurs?: JSON;
  puissance?: number;
  puissanceAuMomentDuDepot?: number;
  evaluationCarbone?: number;
  delayInMonths?: number;
  dateAchèvementDemandée?: Date;
  confirmationRequestedBy?: string;
  confirmationRequestedOn?: number;
  confirmedBy?: string;
  confirmedOn?: number;
  cancelledBy?: string;
  cancelledOn?: number;
  isLegacy: CreationOptional<boolean | null>;
  cahierDesCharges?: string;
  délaiAccordéCorrigéLe?: string;
  délaiAccordéCorrigéPar?: string;
  dateAchèvementAprèsCorrectionDélaiAccordé?: string;

  project: NonAttribute<Project>;
  requestedBy: NonAttribute<{ email: string; fullName: string }>;
  attachmentFile: NonAttribute<{ id: string; filename: string }>;
}
