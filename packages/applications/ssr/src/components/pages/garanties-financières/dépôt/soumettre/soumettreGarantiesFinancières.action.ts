'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { document } from '@/utils/zod/documentTypes';

export type SoumettreGarantiesFinancièresState = FormState;

const commonSchema = {
  identifiantProjet: zod.string().min(1),
  dateConstitution: zod
    .string()
    .min(1, { message: 'Date de constitution des garanties financières obligatoire' }),
  attestation: document,
};
const schema = zod.discriminatedUnion('type', [
  zod.object({
    ...commonSchema,
    type: zod.literal('avec-date-échéance'),
    dateEcheance: zod.string().min(1, { message: "Date d'échéance à transmettre" }),
  }),
  zod.object({
    ...commonSchema,
    type: zod.enum(['six-mois-après-achèvement', 'consignation']),
  }),
]);

const action: FormAction<FormState, typeof schema> = async (_, props) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<GarantiesFinancières.GarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.SoumettreDépôtGarantiesFinancières',
      data: {
        identifiantProjetValue: props.identifiantProjet,
        typeValue: props.type,
        dateConstitutionValue: new Date(props.dateConstitution).toISOString(),
        soumisLeValue: new Date().toISOString(),
        soumisParValue: utilisateur.identifiantUtilisateur.formatter(),
        ...(props.type === 'avec-date-échéance' && {
          dateÉchéanceValue: new Date(props.dateEcheance).toISOString(),
        }),
        attestationValue: {
          content: props.attestation.stream(),
          format: props.attestation.type,
        },
      },
    });

    return {
      status: 'success',
      redirectUrl: Routes.GarantiesFinancières.détail(props.identifiantProjet),
    };
  });

export const soumettreGarantiesFinancièresAction = formAction(action, schema);
