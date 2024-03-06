'use server';

import * as zod from 'zod';

import { FormAction, FormState, formAction } from '@/utils/formAction';

export type enregistrerAttestationGarantiesFinancièresState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  dateConstitution: zod.string().min(1),
  attestationConstitution: zod.instanceof(Blob).refine((data) => data.size > 0),
});

/**
 * @todo add usecase
 */
const action: FormAction<FormState, typeof schema> = async (_, props) => {
  return {
    status: 'success',
  };
};

export const enregistrerAttestationGarantiesFinancièresAction = formAction(action, schema);
