import zod from 'zod';

import { gestionnaireSchema } from './constant';

export type OreGestionnaire = Omit<zod.TypeOf<typeof gestionnaireSchema>, 'eic'> & {
  eic: string;
};
