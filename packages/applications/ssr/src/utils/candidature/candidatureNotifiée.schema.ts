import { z } from 'zod';

import { Candidature } from '@potentiel-domain/projet';

import { identifiantProjetSchema } from './identifiantProjet.schema';
import { NestedKeysForSchema } from './nestedKeysForSchema';
import {
  dateDAutorisationDUrbanismeOuEnvironnementaleSchema,
  dépôtSchema,
  numéroDAutorisationDUrbanismeOuEnvironnementaleSchema,
} from './dépôt.schema';
import { instructionSchema } from './instruction.schema';
import { booleanSchema, optionalEnumForCorrection } from './schemaBase';

export const doitRegenererAttestationSchema = booleanSchema.optional();

const candidatureNotifiéeSchema = dépôtSchema
  .pick({
    sociétéMère: true,
    nomReprésentantLégal: true,
    technologie: true,
    nomCandidat: true,
    prixReference: true,
    evaluationCarboneSimplifiée: true,
    emailContact: true,
    nomProjet: true,
    puissanceALaPointe: true,
    puissance: true,
    coefficientKChoisi: true,
    puissanceDeSite: true,
    installateur: true,
    dispositifDeStockage: true,
    natureDeLExploitation: true,
  })
  .extend({
    dateDAutorisationDUrbanisme: dateDAutorisationDUrbanismeOuEnvironnementaleSchema,
    numéroDAutorisationDUrbanisme: numéroDAutorisationDUrbanismeOuEnvironnementaleSchema,
    actionnariat: optionalEnumForCorrection(z.enum(Candidature.TypeActionnariat.types)),
    noteTotale: instructionSchema.shape.noteTotale,
  })
  .extend(dépôtSchema.shape.localité.shape);

const partialCandidatureNotifiéeSchema = candidatureNotifiéeSchema.partial();

const lauréatSchema = dépôtSchema
  .pick({
    sociétéMère: true,
    nomReprésentantLégal: true,
    nomProjet: true,
    puissance: true,
    puissanceDeSite: true,
    evaluationCarboneSimplifiée: true,
    nomCandidat: true,
  })
  .extend(dépôtSchema.shape.localité.shape);

const partialLauréatSchema = lauréatSchema.partial();

export const modifierLauréatEtCandidatureSchéma = z
  .object({
    identifiantProjet: identifiantProjetSchema,
    candidature: partialCandidatureNotifiéeSchema.optional(),
    laureat: partialLauréatSchema.optional(),
    doitRegenererAttestation: doitRegenererAttestationSchema,
  })
  .refine((value) => value.laureat || value.candidature, {
    // little hack to display this error for the entire form
    path: ['identifiantProjet'],
    message: 'Le formulaire ne contient pas de modification',
  })
  .refine((value) => !(value.candidature && value.doitRegenererAttestation === undefined), {
    path: ['doitRegenererAttestation'],
    message:
      "Vous devez choisir de régénérer ou pas l'attestation lorsque la candidature est corrigée",
  })
  .refine(
    (value) =>
      value.candidature || (!value.candidature && value.laureat && !value.doitRegenererAttestation),
    {
      path: ['doitRegenererAttestation'],
      message: "Vous pouvez régénérer l'attestation uniquement lorsque la candidature est corrigée",
    },
  );

export type ModifierCandidatureNotifiéeFormEntries = z.infer<typeof candidatureNotifiéeSchema>;
export type PartialModifierCandidatureNotifiéeFormEntries = z.infer<
  typeof partialCandidatureNotifiéeSchema
>;
export type ModifierLauréatValueFormEntries = z.infer<typeof lauréatSchema>;

export type PartialModifierLauréatValueFormEntries = z.infer<typeof partialLauréatSchema>;
export type ModifierLauréatKeys = keyof ModifierLauréatValueFormEntries;

export type ModifierLauréatEtCandidatureNotifiéeFormEntries = NestedKeysForSchema<
  z.infer<typeof modifierLauréatEtCandidatureSchéma>
>;
