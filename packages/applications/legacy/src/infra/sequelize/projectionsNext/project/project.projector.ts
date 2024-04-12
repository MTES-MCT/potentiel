import { makeSequelizeProjector } from '../makeSequelizeProjector';
import { Project } from './project.model';

export const ProjectProjector = makeSequelizeProjector(Project);
