'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { optionalStrictlyPositiveNumberSchema } from '@/utils/candidature/schemaBase';
import { manyDocuments } from '@/utils/zod/document/manyDocuments';

const schema = zod
  .object({
    identifiantProjet: zod.string().min(1),
    installationAvecDispositifDeStockage: zod.stringbool(),
    capaciteDuDispositifDeStockageEnKWh: optionalStrictlyPositiveNumberSchema,
    puissanceDuDispositifDeStockageEnKW: optionalStrictlyPositiveNumberSchema,
    raison: zod.string().min(1),
    piecesJustificatives: manyDocuments({
      acceptedFileTypes: ['application/pdf'],
      optional: true,
    }),
  })
  .refine(
    (val) =>
      (val.installationAvecDispositifDeStockage &&
        val.capaciteDuDispositifDeStockageEnKWh !== undefined &&
        val.puissanceDuDispositifDeStockageEnKW !== undefined) ||
      !val.installationAvecDispositifDeStockage,
    'La capacité et la puissance du dispositif de stockage sont requises',
  );

export type ModifierDispositifDeStockageFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  {
    identifiantProjet,
    installationAvecDispositifDeStockage,
    capaciteDuDispositifDeStockageEnKWh,
    puissanceDuDispositifDeStockageEnKW,
    raison,
    piecesJustificatives,
  },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Installation.ModifierDispositifDeStockageUseCase>({
      type: 'Lauréat.Installation.UseCase.ModifierDispositifDeStockage',
      data: {
        identifiantProjetValue: identifiantProjet,
        modifiéParValue: utilisateur.identifiantUtilisateur.formatter(),
        modifiéLeValue: new Date().toISOString(),
        dispositifDeStockageValue: {
          installationAvecDispositifDeStockage,
          capacitéDuDispositifDeStockageEnKWh: capaciteDuDispositifDeStockageEnKWh,
          puissanceDuDispositifDeStockageEnKW,
        },
        raisonValue: raison,
        pièceJustificativeValue: piecesJustificatives,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Lauréat.détails.installation(identifiantProjet),
        message: 'Le changement de dispositif de stockage a été pris en compte',
      },
    };
  });

export const modifierDispositifDeStockageAction = formAction(action, schema);
