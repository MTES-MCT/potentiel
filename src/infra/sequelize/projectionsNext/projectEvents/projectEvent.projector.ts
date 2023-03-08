import { makeSequelizeProjector } from '../makeSequelizeProjector';
import { ProjectEvent } from './projectEvent.model';

export const ProjectEventProjector = makeSequelizeProjector(ProjectEvent);
