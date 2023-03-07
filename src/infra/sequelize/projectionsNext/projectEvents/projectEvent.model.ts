import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { makeSequelizeProjector } from '../makeSequelizeProjector';
import { Payload } from './Payload';

export class ProjectEvent extends Model<
  InferAttributes<ProjectEvent>,
  InferCreationAttributes<ProjectEvent>
> {
  id: string;
  projectId: string;
  type: string;
  payload: Payload | null;
  valueDate: number;
  eventPublishedAt: number;
}

export const ProjectEventProjector = makeSequelizeProjector(ProjectEvent);
