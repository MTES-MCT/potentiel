'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';

import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  keepOrUpdateManyDocuments,
  keepOrUpdateSingleDocument,
} from '@/utils/zod/document/keepOrUpdateDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  attestation: keepOrUpdateManyDocuments({ acceptedFileTypes: ['application/pdf'] }),
  preuveTransmissionAuCocontractant: keepOrUpdateSingleDocument({
    acceptedFileTypes: ['application/pdf'],
  }),
  dateTransmissionAuCocontractant: zod.string().min(1, { message: 'Champ obligatoire' }),
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
    await mediator.send<Lauréat.Achèvement.AttestationConformité.ModifierAttestationConformitéUseCase>(
      {
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
      },
    );

    return {
      status: 'success',
      redirection: {
        url: Routes.Projet.details(identifiantProjet),
      },
    };
  });

export const modifierAttestationConformitéAction = formAction(action, schema);
