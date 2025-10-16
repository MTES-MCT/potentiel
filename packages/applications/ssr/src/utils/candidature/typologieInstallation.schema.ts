import { z } from 'zod';

import { Candidature } from '@potentiel-domain/projet';

export const typologieInstallationSchema = z.array(
  z.object({
    typologie: z.enum(Candidature.TypologieInstallation.typologies),
    détails: z.string().optional(),
  }),
);
