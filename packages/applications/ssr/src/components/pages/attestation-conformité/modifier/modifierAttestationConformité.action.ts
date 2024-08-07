'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Achèvement } from '@potentiel-domain/laureat';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { document } from '@/utils/zod/documentType';

export type ModifierAttestationConformitéState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  attestation: document,
  preuveTransmissionAuCocontractant: document,
  dateTransmissionAuCocontractant: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (
  _,
  {
    identifiantProjet,
    dateTransmissionAuCocontractant,
    attestation,
    preuveTransmissionAuCocontractant,
  },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Achèvement.ModifierAttestationConformitéUseCase>({
      type: 'Lauréat.Achèvement.AttestationConformité.UseCase.ModifierAttestationConformité',
      data: {
        identifiantProjetValue: identifiantProjet,
        attestationValue: attestation,
        preuveTransmissionAuCocontractantValue: preuveTransmissionAuCocontractant,
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
