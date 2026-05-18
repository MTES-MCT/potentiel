'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { NestedKeysForSchema } from '@/utils/candidature';
import { optionalStrictlyPositiveNumberSchema } from '@/utils/candidature/schemaBase';
import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod
  .object({
    identifiantProjet: zod.string().min(1),
    raison: zod.string().min(1),
    piecesJustificatives: singleDocument({
      acceptedFileTypes: ['application/pdf'],
    }),
    installationAvecDispositifDeStockage: zod.stringbool(),
    capaciteDuDispositifDeStockageEnKWh: optionalStrictlyPositiveNumberSchema,
    puissanceDuDispositifDeStockageEnKW: optionalStrictlyPositiveNumberSchema,
  })
  .refine(
    (val) =>
      (val.installationAvecDispositifDeStockage &&
        val.capaciteDuDispositifDeStockageEnKWh !== undefined &&
        val.puissanceDuDispositifDeStockageEnKW !== undefined) ||
      !val.installationAvecDispositifDeStockage,
    'La capacité et la puissance du dispositif de stockage sont requises',
  );

export type EnregistrerChangementDispositifDeStockageFormKeys = NestedKeysForSchema<
  zod.infer<typeof schema>
>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  {
    identifiantProjet,
    piecesJustificatives,
    raison,
    installationAvecDispositifDeStockage,
    capaciteDuDispositifDeStockageEnKWh,
    puissanceDuDispositifDeStockageEnKW,
  },
) =>
  withUtilisateur(async (utilisateur) => {
    const date = new Date().toISOString();

    await mediator.send<Lauréat.Installation.EnregistrerChangementDispositifDeStockageUseCase>({
      type: 'Lauréat.Installation.UseCase.EnregistrerChangementDispositifDeStockage',
      data: {
        identifiantProjetValue: identifiantProjet,
        enregistréParValue: utilisateur.identifiantUtilisateur.formatter(),
        enregistréLeValue: date,
        pièceJustificativeValue: piecesJustificatives,
        raisonValue: raison,
        dispositifDeStockageValue: {
          installationAvecDispositifDeStockage,
          capacitéDuDispositifDeStockageEnKWh: capaciteDuDispositifDeStockageEnKWh,
          puissanceDuDispositifDeStockageEnKW,
        },
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Installation.changement.dispositifDeStockage.détails(identifiantProjet, date),
        message: 'Le changement de dispositif de stockage a bien été enregistré.',
      },
    };
  });

export const enregistrerChangementDispositifDeStockageAction = formAction(action, schema);
