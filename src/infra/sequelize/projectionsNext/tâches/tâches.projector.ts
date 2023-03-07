import { makeSequelizeProjector } from '../makeSequelizeProjector';
import { Tâches } from './tâches.model';

export const TâchesProjector = makeSequelizeProjector(Tâches);
