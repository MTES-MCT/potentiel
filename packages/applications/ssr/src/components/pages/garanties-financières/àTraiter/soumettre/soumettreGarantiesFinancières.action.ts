'use server';

import * as zod from 'zod';

import { FormAction, FormState, formAction } from '@/utils/formAction';

export type SoumettreGarantiesFinancièresState = FormState;

const schema = zod.discriminatedUnion('typeGarantiesFinancieres', [
  zod.object({
    typeGarantiesFinancieres: zod.literal('avec date d’échéance'),
    identifiantProjet: zod.string().min(1),
    dateEcheance: zod.string().min(1),
    dateConstitution: zod.string().min(1),
  }),
  zod.object({
    typeGarantiesFinancieres: zod.enum(['6 mois après achèvement', 'consignation']),
    identifiantProjet: zod.string().min(1),
    dateConstitution: zod.string().min(1),
  }),
]);

const action: FormAction<FormState, typeof schema> = async (_, props) => {
  /**
   * @todo Appel au usecase à ajouter quand il sera prêt
   */
  return {
    status: 'success',
  };
};

export const soumettreGarantiesFinancièresAction = formAction(action, schema);
