import { makeSequelizeProjector } from '../makeSequelizeProjector';
import { ModificationRequest } from './modificationRequest.model';

export const ModificationRequestProjector = makeSequelizeProjector(ModificationRequest);
