'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  keepOrUpdateManyDocuments,
  keepOrUpdateSingleOptionalDocument,
} from '@/utils/zod/document/keepOrUpdateDocument';

import { getAchèvement } from '../../_helpers';

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
    if (!attestationHasChanged && !preuveTransmissionAuCocontractantHasChanged) {
      const achèvement = await getAchèvement(
        IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
      );

      if (
        achèvement.estAchevé &&
        Option.isSome(achèvement.preuveTransmissionAuCocontractant) &&
        DateTime.convertirEnValueType(
          achèvement.preuveTransmissionAuCocontractant.dateCréation,
        ).estÉgaleÀ(
          DateTime.convertirEnValueType(new Date(dateTransmissionAuCocontractant).toISOString()),
        )
      )
        return {
          status: 'validation-error',
          errors: {
            attestation: 'Au moins une modification doit être transmise',
            preuveTransmissionAuCocontractant: 'Au moins une modification doit être transmise',
            dateTransmissionAuCocontractant: 'Au moins une modification doit être transmise',
          },
        };
    }

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
