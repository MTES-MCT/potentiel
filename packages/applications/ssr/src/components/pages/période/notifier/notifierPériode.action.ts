'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';
import { Période } from '@potentiel-domain/periode';
import { IdentifiantPériode } from '@potentiel-domain/periode/dist/période';
import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

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
        validateurValue: {
          fonction: Option.match(utilisateur.fonction)
            .some((fonction) => fonction)
            .none(() => ''),
          nomComplet: utilisateur.nom,
        },
        identifiantCandidatureValues: candidatures.items.map((candidatures) =>
          candidatures.identifiantProjet.formatter(),
        ),
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Candidature.lister({ appelOffre, période: periode }),
        message: `La période ${periode} de l'appel d'offre ${appelOffre} a bien été notifiée`,
      },
    };
  });
};

export const notifierPériodeAction = formAction(action, schema);
