'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';

import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const commonSchema = {
  identifiantProjet: zod.string().min(1),
  dateConstitution: zod.string().min(1, { message: 'Champ obligatoire' }),
  attestation: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
};
const schema = zod.discriminatedUnion('type', [
  zod.object({
    ...commonSchema,
    type: zod.literal('avec-date-échéance'),
    dateEcheance: zod.string().min(1, { message: 'Champ obligatoire' }),
  }),
  zod.object({
    ...commonSchema,
    type: zod.enum(['six-mois-après-achèvement', 'consignation']),
  }),
]);

export type EnregistrerGarantiesFinancièresFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (_, props) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.GarantiesFinancières.EnregistrerGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.EnregistrerGarantiesFinancières',
      data: {
        identifiantProjetValue: props.identifiantProjet,
        garantiesFinancièresValue: {
          type: props.type,
          dateÉchéance:
            props.type === 'avec-date-échéance'
              ? new Date(props.dateEcheance).toISOString()
              : undefined,
        },
        dateConstitutionValue: new Date(props.dateConstitution).toISOString(),
        attestationValue: props.attestation,
        enregistréLeValue: new Date().toISOString(),
        enregistréParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
      redirection: { url: Routes.GarantiesFinancières.détail(props.identifiantProjet) },
    };
  });

export const enregistrerGarantiesFinancièresAction = formAction(action, schema);
