'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { localitéSchema } from '@/utils/candidature/localité.schema';
import { manyDocuments } from '@/utils/zod/document/manyDocuments';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  raison: zod.string().min(1),
  piecesJustificatives: manyDocuments({ optional: true, acceptedFileTypes: ['application/pdf'] }),
  adresse1: localitéSchema.shape.adresse1,
  adresse2: localitéSchema.shape.adresse2,
  codePostal: localitéSchema.shape.codePostal,
  commune: localitéSchema.shape.commune,
  departement: localitéSchema.shape.département,
  region: localitéSchema.shape.région,
  accesAuProjetPerdu: zod.stringbool().optional(),
});
export type ModifierSiteDeProductionFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  {
    identifiantProjet,
    raison,
    adresse1,
    adresse2,
    codePostal,
    commune,
    departement,
    region,
    accesAuProjetPerdu,
    piecesJustificatives,
  },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.ModifierSiteDeProductionUseCase>({
      type: 'Lauréat.UseCase.ModifierSiteDeProduction',
      data: {
        identifiantProjetValue: identifiantProjet,
        localitéValue: {
          adresse1,
          adresse2: adresse2 ?? '',
          codePostal,
          commune,
          département: departement,
          région: region,
        },
        modifiéParValue: utilisateur.identifiantUtilisateur.formatter(),
        modifiéLeValue: DateTime.now().formatter(),
        raisonValue: raison,
        pièceJustificativeValue: piecesJustificatives,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: accesAuProjetPerdu
          ? Routes.Lauréat.lister()
          : Routes.Lauréat.détails.informationGénérales(identifiantProjet),
        message: 'Le site de production a été modifié',
      },
    };
  });

export const modifierSiteDeProductionAction = formAction(action, schema);
