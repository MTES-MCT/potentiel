'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/candidature';
import { Lauréat } from '@potentiel-domain/laureat';
import { DateTime } from '@potentiel-domain/common';
import { Éliminé } from '@potentiel-domain/elimine';
import { DomainError } from '@potentiel-domain/core';

import { ActionResult, FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

export type NotifierCandidaturesState = FormState;

const schema = zod.object({
  periode: zod.string(),
  appelOffre: zod.string(),
});

const action: FormAction<FormState, typeof schema> = (_, { appelOffre, periode }) =>
  withUtilisateur(async (utilisateur) => {
    const candidatures = await mediator.send<Candidature.ListerCandidaturesQuery>({
      type: 'Candidature.Query.ListerCandidatures',
      data: {
        appelOffre,
        période: periode,
      },
    });

    if (candidatures.total === 0) {
      return {
        status: 'form-error',
        errors: ['candidatures'],
      };
    }

    let success: number = 0;
    const errors: ActionResult['errors'] = [];
    for (const candidature of candidatures.items) {
      try {
        const payload = {
          notifiéLeValue: DateTime.now().formatter(),
          notifiéParValue: utilisateur.identifiantUtilisateur.email,
          attestationValue: {
            format: 'application/pdf',
          },
          identifiantProjetValue: candidature.identifiantProjet.formatter(),
        };
        if (candidature.statut.estClassé()) {
          await mediator.send<Lauréat.NotifierLauréatUseCase>({
            type: 'Lauréat.UseCase.NotifierLauréat',
            data: payload,
          });
        } else {
          await mediator.send<Éliminé.NotifierÉliminéUseCase>({
            type: 'Éliminé.UseCase.NotifierÉliminé',
            data: payload,
          });
        }
        success++;
      } catch (error) {
        if (error instanceof DomainError) {
          errors.push({
            key: candidature.identifiantProjet.formatter(),
            reason: error.message,
          });
          continue;
        }
        errors.push({
          key: candidature.identifiantProjet.formatter(),
          reason: `Une erreur inconnue empêche la notification de la candidature`,
        });
      }
    }

    return {
      status: 'success',
      result: {
        successCount: success,
        errors,
      },
    };
  });

export const notifierCandidaturesAction = formAction(action, schema);
