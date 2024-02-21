'use server';

import * as zod from 'zod';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (_, { identifiantProjet }) => {
  return withUtilisateur(async (utilisateur) => {
    /**
     * @todo appel au use-case à faire
     */
    return {
      status: 'success',
    };
  });
};

export const validerGarantiesFinancièresAction = formAction(action, schema);
