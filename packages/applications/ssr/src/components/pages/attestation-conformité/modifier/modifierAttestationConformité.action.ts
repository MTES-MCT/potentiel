'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Achèvement } from '@potentiel-domain/laureat';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

export type ModifierAttestationConformitéState = FormState;

const document = zod
  .string()
  .or(zod.instanceof(Blob))
  .transform(async (documentKeyOrBlob) => {
    if (typeof documentKeyOrBlob === 'string') {
      const document = await mediator.send<ConsulterDocumentProjetQuery>({
        type: 'Document.Query.ConsulterDocumentProjet',
        data: {
          documentKey: documentKeyOrBlob,
        },
      });
      return document;
    }

    return {
      content: documentKeyOrBlob.stream(),
      format: documentKeyOrBlob.type,
    };
  });

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  attestation: zod.instanceof(Blob).refine((data) => data.size > 0),
  preuveTransmissionAuCocontractant: zod.instanceof(Blob).refine((data) => data.size > 0),
  dateTransmissionAuCocontractant: zod.string().min(1),
  test: document,
});

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, dateTransmissionAuCocontractant, preuveTransmissionAuCocontractant, test },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Achèvement.ModifierAttestationConformitéUseCase>({
      type: 'Lauréat.Achèvement.AttestationConformité.UseCase.ModifierAttestationConformité',
      data: {
        identifiantProjetValue: identifiantProjet,
        attestationValue: test,
        preuveTransmissionAuCocontractantValue: {
          content: preuveTransmissionAuCocontractant.stream(),
          format: preuveTransmissionAuCocontractant.type,
        },
        dateTransmissionAuCocontractantValue: new Date(
          dateTransmissionAuCocontractant,
        ).toISOString(),
        dateValue: new Date().toISOString(),
        utilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
    };
  });

export const modifierAttestationConformitéAction = formAction(action, schema);
