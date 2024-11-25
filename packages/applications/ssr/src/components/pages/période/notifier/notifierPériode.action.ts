'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { DateTime } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';
import { Période } from '@potentiel-domain/periode';
import { IdentifiantPériode } from '@potentiel-domain/periode/dist/période';
import { Routes } from '@potentiel-applications/routes';
import { ConsulterUtilisateurQuery } from '@potentiel-domain/utilisateur';
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

    const utilisateurDetails = await mediator.send<ConsulterUtilisateurQuery>({
      type: 'Utilisateur.Query.ConsulterUtilisateur',
      data: {
        identifiantUtilisateur: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    if (Option.isNone(utilisateurDetails)) {
      return notFound();
    }

    await mediator.send<Période.NotifierPériodeUseCase>({
      type: 'Période.UseCase.NotifierPériode',
      data: {
        identifiantPériodeValue,
        notifiéeLeValue: DateTime.now().formatter(),
        notifiéeParValue: utilisateur.identifiantUtilisateur.formatter(),
        validateurValue: {
          fonction: utilisateurDetails.fonction,
          nomComplet: utilisateurDetails.nomComplet,
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
        successMessage: `La période ${periode} de l'appel d'offre ${appelOffre} a bien été notifiée`,
      },
    };
  });
};

export const notifierPériodeAction = formAction(action, schema);
