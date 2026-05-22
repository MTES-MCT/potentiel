'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';

import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  documentSelectionSchema,
  keepOrUpdateSingleOptionalDocument,
} from '@/utils/zod/document/keepOrUpdateDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  attestation: keepOrUpdateSingleOptionalDocument({ acceptedFileTypes: ['application/pdf'] }),
  rapportAssocie: keepOrUpdateSingleOptionalDocument({
    acceptedFileTypes: ['application/pdf'],
  }),
  preuveTransmissionAuCocontractant: keepOrUpdateSingleOptionalDocument({
    acceptedFileTypes: ['application/pdf'],
  }),
  attestationDocumentSelection: documentSelectionSchema.optional(),
  rapportAssocieDocumentSelection: documentSelectionSchema.optional(),
  preuveTransmissionAuCocontractantDocumentSelection: documentSelectionSchema.optional(),
  dateTransmissionAuCocontractant: zod.string().min(1),
  raison: zod.string().min(1),
});

export type ModifierAchèvementFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  {
    identifiantProjet,
    dateTransmissionAuCocontractant,
    attestation,
    attestationDocumentSelection,
    rapportAssocie,
    rapportAssocieDocumentSelection,
    preuveTransmissionAuCocontractant,
    preuveTransmissionAuCocontractantDocumentSelection,
    raison,
  },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Achèvement.ModifierAchèvementUseCase>({
      type: 'Lauréat.Achèvement.UseCase.ModifierAchèvement',
      data: {
        identifiantProjetValue: identifiantProjet,
        dateValue: new Date().toISOString(),
        utilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        raisonValue: raison,
        attestationValue:
          attestationDocumentSelection === 'keep_existing_document' ? undefined : attestation,
        rapportAssociéValue:
          rapportAssocieDocumentSelection === 'keep_existing_document' ? undefined : rapportAssocie,
        preuveTransmissionAuCocontractantValue:
          preuveTransmissionAuCocontractantDocumentSelection === 'keep_existing_document'
            ? undefined
            : preuveTransmissionAuCocontractant,
        dateTransmissionAuCocontractantValue: new Date(
          dateTransmissionAuCocontractant,
        ).toISOString(),
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Lauréat.détails.tableauDeBord(identifiantProjet),
        message: "L'attestation de conformité a bien été modifiée",
      },
    };
  });

export const modifierAchèvementAction = formAction(action, schema);
