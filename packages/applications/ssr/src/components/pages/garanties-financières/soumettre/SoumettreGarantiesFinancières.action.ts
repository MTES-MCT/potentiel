'use server';

import * as zod from 'zod';

import { FormAction, FormState, formAction } from '@/utils/formAction';

export type SoumettreDépôtGarantiesFinancièresState = FormState;

const schema = zod
  .object({
    identifiantProjet: zod.string(),
    typeGarantiesFinancieres: zod.string(),
    dateEcheance: zod.string().optional(),
    dateConstitution: zod.string(),
  })
  .refine(
    (data) =>
      data.typeGarantiesFinancieres === "avec date d'échéance" && !data.dateEcheance ? false : true,
    {
      path: ['dateEcheance'],
    },
  );

const action: FormAction<FormState, typeof schema> = async (
  _,
  { typeGarantiesFinancieres, dateEcheance, identifiantProjet, dateConstitution },
) => {
  /**
   * @todo Appel au usecase à ajouter quand il sera prêt
   */
  return {
    status: 'success',
  };
};

export const soumettreDépôtGarantiesFinancièresAction = formAction(action, schema);
