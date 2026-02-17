import { optionalStringWithDefaultValueSchema, requiredStringSchema } from './schemaBase';

export const identifiantProjetSchema = requiredStringSchema;

export const appelOffreSchema = requiredStringSchema;
export const périodeSchema = requiredStringSchema;
export const familleSchema = optionalStringWithDefaultValueSchema;
export const numéroCRESchema = requiredStringSchema;
