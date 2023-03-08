import { makeSequelizeProjector } from '../makeSequelizeProjector';
import { Raccordements } from './raccordements.model';

export const RaccordementsProjector = makeSequelizeProjector(Raccordements);
