'use server';

import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  dateAchevementPrevisionnelleActuelle: zod.string().min(1),
  nombreDeMois: zod
    .string()
    .min(1, { message: 'Champ obligatoire' })
    .transform((val) => {
      const n = Number(val);
      return isNaN(n) ? undefined : n;
    })
    .refine((val) => typeof val === 'number' && val >= 1, {
      message: 'Le nombre de mois doit être supérieur ou égal à 1',
    }),
  raison: zod.string().min(1, { message: 'Champ obligatoire' }),
  pieceJustificative: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
});

export type DemanderDélaiFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (_, { identifiantProjet }) => {
  return withUtilisateur(async () => {
    /**
     * TODO : USE CASE À APPELER
     */

    return {
      status: 'success',
      redirection: { url: Routes.Délai.demander(identifiantProjet) },
    };
  });
};

export const demanderDélaiAction = formAction(action, schema);
