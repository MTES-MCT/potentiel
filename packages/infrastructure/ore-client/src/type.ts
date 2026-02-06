import zod from 'zod';

import { gestionnaireSchema } from './constant.js';

export type OreGestionnaire = Omit<zod.TypeOf<typeof gestionnaireSchema>, 'eic'> & {
  eic: string;
};
