import { z } from 'zod';

import { DateTime } from '@potentiel-domain/common';

const dateParDéfautFormulaireCRE = '00/01/1900';
const parseCsvDate = (val: string | undefined) => {
  if (!val || val === dateParDéfautFormulaireCRE) return;
  const [day, month, year] = val.split('/');
  return DateTime.convertirEnValueType(new Date(`${year}-${month}-${day}`)).formatter();
};

const refineCsvDate = (val: string | undefined, ctx: z.RefinementCtx) => {
  try {
    parseCsvDate(val);
  } catch (e) {
    ctx.addIssue({
      code: 'custom',
      message: e instanceof Error ? e.message : 'Format de date invalide',
    });
  }
};

export const optionalCsvDateSchema = z
  .string()
  .regex(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: "Le format de la date n'est pas respecté (format attendu : JJ/MM/AAAA)",
  })
  .or(z.literal(''))
  .or(z.literal(dateParDéfautFormulaireCRE))
  .optional()
  .superRefine(refineCsvDate)
  .transform((val) => {
    return parseCsvDate(val);
  });
