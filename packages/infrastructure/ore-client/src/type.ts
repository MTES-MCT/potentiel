import type zod from 'zod';

import type { gestionnaireSchema } from './constant';

export type OreGestionnaire = Omit<zod.TypeOf<typeof gestionnaireSchema>, 'eic'> & {
  eic: string;
};
