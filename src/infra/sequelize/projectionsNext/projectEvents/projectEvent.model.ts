import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { Payload } from './Payload';
import { makeSequelizeProjector } from '../../helpers';

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

export const projectEventTableName = 'project_events';

export const ProjectEventProjector = makeSequelizeProjector(ProjectEvent, projectEventTableName);
