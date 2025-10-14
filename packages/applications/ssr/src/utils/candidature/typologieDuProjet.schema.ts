import { z } from 'zod';

import { Candidature } from '@potentiel-domain/projet';

export const typologieDuProjetSchema = z.array(
  z.object({
    typologie: z.enum(Candidature.TypologieDuProjet.typologies),
    détails: z.string().optional(),
  }),
);
