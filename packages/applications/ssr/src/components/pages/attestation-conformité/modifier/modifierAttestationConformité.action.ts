'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Achèvement } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { keepOrUpdateDocument } from '@/utils/zod/documentTypes';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  attestation: keepOrUpdateDocument,
  preuveTransmissionAuCocontractant: keepOrUpdateDocument,
  dateTransmissionAuCocontractant: zod.string().min(1, { message: 'Date à préciser' }),
});

export type ModifierAttestationConformitéFormKeys = keyof zod.infer<typeof schema>;

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
      redirectUrl: Routes.Projet.details(identifiantProjet),
    };
  });

export const modifierAttestationConformitéAction = formAction(action, schema);
