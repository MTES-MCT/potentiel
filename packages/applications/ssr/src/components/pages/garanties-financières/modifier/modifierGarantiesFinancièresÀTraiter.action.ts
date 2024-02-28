'use server';

import * as zod from 'zod';

import { FormAction, FormState, formAction } from '@/utils/formAction';

export type ModifierGarantiesFinancièresState = FormState;

const commonSchema = {
  identifiantProjet: zod.string().min(1),
  dateConstitution: zod.string().min(1),
  attestation: zod.instanceof(Blob),
};

const schema = zod.discriminatedUnion('type', [
  zod.object({
    ...commonSchema,
    type: zod.literal('avec date d’échéance'),
    dateEcheance: zod.string().min(1),
  }),
  zod.object({
    ...commonSchema,
    type: zod.enum(['6 mois après achèvement', 'consignation']),
  }),
]);

/**
 * @todo add usecase
 */
const action: FormAction<FormState, typeof schema> = async (_, props) => {
  return {
    status: 'success',
  };
};

export const modifierGarantiesFinancièresÀTraiterAction = formAction(action, schema);
