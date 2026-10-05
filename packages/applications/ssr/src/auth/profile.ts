import { defineRequestState } from '@better-auth/core/context';
import z from 'zod';

// https://partenaires.proconnect.gouv.fr/docs/fournisseur-service/niveaux-acr
const acrValues = [
  'eidas0',
  'eidas0-mfa',
  'eidas1',
  'eidas1-mfa',
  'eidas2',
  'eidas3',
  'https://proconnect.gouv.fr/assurance/certification-dirigeant',
] as const;

const acrSchema = z.enum(acrValues);

const customSchema = z.object({
  // SIRET de l'organisation selectionnée
  siret: z.string().optional(),
  // identifiant du fournisseur d'identitié utilisé
  idp_id: z.string().optional(),
  // liste des méthodes d'authentification utilisées.
  amr: z.array(z.string()).optional(),
  // niveau de confiance de l'authentification
  acr: acrSchema.optional().catch(undefined),
});

export type CustomProfile = z.infer<typeof customSchema>;

// Ces données ne servent qu'à usage de statistiques et ne doivent pas persister (user, cookie de session).
const customProfileState = defineRequestState<CustomProfile | undefined>(() => undefined);

type SetCustomProfileProps = Record<string, unknown>;

export const setCustomProfile = (profile: SetCustomProfileProps) =>
  customProfileState.set(customSchema.safeParse(profile).data);

export const getCustomProfile = () => customProfileState.get();
