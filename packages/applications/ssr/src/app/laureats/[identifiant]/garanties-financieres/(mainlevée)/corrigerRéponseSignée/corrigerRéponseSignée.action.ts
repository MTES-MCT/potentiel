'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { CorrigerDocumentProjetCommand } from '@potentiel-domain/document';
import { Routes } from '@potentiel-applications/routes';
import { AccèsFonctionnalitéRefuséError } from '@potentiel-domain/utilisateur';

import { singleDocument } from '@/utils/zod/document/singleDocument';
import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  documentCorrige: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
  courrierReponseACorriger: zod.string().min(1),
  identifiantProjet: zod.string().min(1),
});

export type CorrigerRéponseSignéeFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, courrierReponseACorriger, documentCorrige },
) =>
  withUtilisateur(async (utilisateur) => {
    if (!utilisateur.role.aLaPermission('garantiesFinancières.mainlevée.corrigerRéponseSignée')) {
      throw new AccèsFonctionnalitéRefuséError(
        'garantiesFinancières.mainlevée.corrigerRéponseSignée',
        utilisateur.role.nom,
      );
    }

    await mediator.send<CorrigerDocumentProjetCommand>({
      type: 'Document.Command.CorrigerDocumentProjet',
      data: {
        content: documentCorrige.content,
        documentProjetKey: courrierReponseACorriger,
      },
    });

    return {
      status: 'success',
      redirection: { url: Routes.GarantiesFinancières.détail(identifiantProjet) },
    };
  });

export const corrigerRéponseSignéeAction = formAction(action, schema);
