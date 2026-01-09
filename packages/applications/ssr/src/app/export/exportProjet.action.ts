'use server';

import zod from 'zod';

import { formAction, FormAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

export type ExportProjetState = FormState;

const schema = zod.object({
  typeExport: zod.enum(['raccordement', 'fournisseur', 'global']),
});

export type ExportProjetFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<ExportProjetState, typeof schema> = async (_, { typeExport }) =>
  withUtilisateur(async (_) => {
    // Implémentation de l'export en fonction du typeExport
    // Par exemple, générer un fichier CSV et le retourner

    return {
      status: 'success',
      message: `Export de type ${typeExport} réalisé avec succès.`,
    };
  });

export const exportProjetAction = formAction(action, schema);
