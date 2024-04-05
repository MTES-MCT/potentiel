'use server';

import * as zod from 'zod';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

export type ModifierGarantiesFinancièresState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (_, props) =>
  withUtilisateur(async (utilisateur) => {
    /***
     * @todo Implement the action
     */
    return {
      status: 'success',
    };
  });

export const relancerGarantiesFinancièresEnAttenteAction = formAction(action, schema);
