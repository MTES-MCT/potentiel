import z from 'zod';

const eidasLevels = ['eidas0', 'eidas0-mfa', 'eidas1', 'eidas1-mfa', 'eidas2', 'eidas3'] as const;
const eidasLevelSchema = z.enum(eidasLevels);

const customSchema = z.object({
  // SIRET de l'organisation selectionnée
  siret: z.string().optional(),
  // identifiant du fournisseur d'identitié utilisé
  idp_id: z.string().optional(),
  // liste des méthodes d'authentification utilisées.
  amr: z.array(z.string()).optional(),
  // niveau de confiance de l'authentification
  acr: eidasLevelSchema.optional(),
});

export type CustomProfile = z.infer<typeof customSchema>;

const userSchema = z.object({
  custom: customSchema,
});

export const parseUserProfileCustomFields = (user: Record<string, unknown>) => {
  return userSchema.safeParse(user)?.data?.custom;
};
