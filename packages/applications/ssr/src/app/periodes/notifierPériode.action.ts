'use server';

import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import type { Période } from '@potentiel-domain/periode';
import type { Candidature } from '@potentiel-domain/projet';
import type { ConsulterUtilisateurQuery } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  appelOffre: zod.string(),
  periode: zod.string(),
});

const action: FormAction<FormState, typeof schema> = async (_, { appelOffre, periode }) => {
  return withUtilisateur(async (utilisateur) => {
    const identifiantPériodeValue: Période.IdentifiantPériode.RawType = `${appelOffre}#${periode}`;

    const candidatures = await mediator.send<Candidature.ListerCandidaturesQuery>({
      type: 'Candidature.Query.ListerCandidatures',
      data: {
        appelOffre: [appelOffre],
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
          fonction: Option.match(utilisateurDetails.fonction)
            .some((fonction) => fonction)
            .none(() => ''),
          nomComplet: Option.match(utilisateurDetails.nomComplet)
            .some((nomComplet) => nomComplet)
            .none(() => ''),
        },
        identifiantCandidatureValues: candidatures.items.map((candidatures) =>
          candidatures.identifiantProjet.formatter(),
        ),
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Candidature.lister({ appelOffre, periode }),
        message: `La période ${periode} de l'appel d'offre ${appelOffre} a bien été notifiée`,
      },
    };
  });
};

export const notifierPériodeAction = formAction(action, schema);
