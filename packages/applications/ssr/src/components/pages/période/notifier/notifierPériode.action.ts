'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';
import { Période } from '@potentiel-domain/periode';
import { IdentifiantPériode } from '@potentiel-domain/periode/dist/période';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

export type NotifierPériodeState = FormState;

const schema = zod.object({
  appelOffre: zod.string(),
  periode: zod.string(),
});

const action: FormAction<FormState, typeof schema> = async (_, { appelOffre, periode }) => {
  return withUtilisateur(async (utilisateur) => {
    const identifiantPériodeValue: IdentifiantPériode.RawType = `${appelOffre}#${periode}`;

    const candidatures = await mediator.send<Candidature.ListerCandidaturesQuery>({
      type: 'Candidature.Query.ListerCandidatures',
      data: {
        appelOffre,
        période: periode,
        estNotifiée: false,
      },
    });

    await mediator.send<Période.NotifierPériodeUseCase>({
      type: 'Période.UseCase.NotifierPériode',
      data: {
        identifiantPériodeValue,
        notifiéeLeValue: DateTime.now().formatter(),
        notifiéeParValue: utilisateur.identifiantUtilisateur.formatter(),
        identifiantCandidatureValues: candidatures.items.map((candidatures) =>
          candidatures.identifiantProjet.formatter(),
        ),
      },
    });

    return {
      status: 'success',
      redirectUrl: Routes.Période.lister({}),
    };
  });
};

export const notifierPériodeAction = formAction(action, schema);
