import * as zod from 'zod';

export const addGarantiesFinancièresToSchema = <T extends zod.ZodRawShape>(
  baseSchema: zod.ZodObject<T>,
) =>
  zod.discriminatedUnion('type', [
    baseSchema.extend({
      type: zod.literal('avec-date-échéance'),
      dateEcheance: zod.string().min(1),
    }),
    baseSchema.extend({
      type: zod.enum(['six-mois-après-achèvement', 'consignation', 'exemption']),
    }),
  ]);
