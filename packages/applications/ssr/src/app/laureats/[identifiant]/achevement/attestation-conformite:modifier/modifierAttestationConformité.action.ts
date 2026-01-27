'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  keepOrUpdateManyDocuments,
  keepOrUpdateSingleOptionalDocument,
} from '@/utils/zod/document/keepOrUpdateDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  attestation: keepOrUpdateManyDocuments({ acceptedFileTypes: ['application/pdf'] }),
  preuveTransmissionAuCocontractant: keepOrUpdateSingleOptionalDocument({
    acceptedFileTypes: ['application/pdf'],
  }),
  attestationHasChanged: zod.stringbool(),
  preuveTransmissionAuCocontractantHasChanged: zod.stringbool(),
  dateTransmissionAuCocontractant: zod.string().min(1),
});

export type ModifierAttestationConformitéFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  {
    identifiantProjet,
    dateTransmissionAuCocontractant,
    attestation,
    preuveTransmissionAuCocontractant,
    attestationHasChanged,
    preuveTransmissionAuCocontractantHasChanged,
  },
) =>
  withUtilisateur(async (utilisateur) => {
    console.log('viovio');
    console.log(attestationHasChanged);
    console.log(preuveTransmissionAuCocontractantHasChanged);
    await mediator.send<Lauréat.Achèvement.ModifierAttestationConformitéUseCase>({
      type: 'Lauréat.AchèvementUseCase.ModifierAttestationConformité',
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
      redirection: {
        url: Routes.Lauréat.détails.tableauDeBord(identifiantProjet),
      },
    };
  });

export const modifierAttestationConformitéAction = formAction(action, schema);
