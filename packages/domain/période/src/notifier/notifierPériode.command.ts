import { Message, MessageHandler, mediator } from 'mediateur';

import { getLogger } from '@potentiel-libraries/monitoring';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { Candidature } from '@potentiel-domain/candidature';
import { Lauréat } from '@potentiel-domain/laureat';
import { Éliminé } from '@potentiel-domain/elimine';

import { loadPériodeFactory } from '../période.aggregate';
import * as IdentifiantPériode from '../identifiantPériode.valueType';

export type NotifierPériodeCommand = Message<
  'Période.Command.NotifierPériode',
  {
    identifiantPériode: IdentifiantPériode.ValueType;
    notifiéeLe: DateTime.ValueType;
    notifiéePar: Email.ValueType;
    identifiantCandidatures: ReadonlyArray<IdentifiantProjet.ValueType>;
  }
>;

export const registerNotifierPériodeCommand = (loadAggregate: LoadAggregate) => {
  const loadPériode = loadPériodeFactory(loadAggregate);
  const loadCandidature = Candidature.Aggregate.loadCandidatureFactory(loadAggregate);

  const handler: MessageHandler<NotifierPériodeCommand> = async ({
    identifiantPériode,
    notifiéeLe,
    notifiéePar,
    identifiantCandidatures,
  }) => {
    const identifiantLauréats: Array<IdentifiantProjet.ValueType> = [];
    const identifiantÉliminés: Array<IdentifiantProjet.ValueType> = [];

    for (const identifiantCandidature of identifiantCandidatures) {
      const candidature = await loadCandidature(identifiantCandidature);

      try {
        if (candidature.statut?.estClassé()) {
          await mediator.send<Lauréat.NotifierLauréatUseCase>({
            type: 'Lauréat.UseCase.NotifierLauréat',
            data: {
              identifiantProjetValue: identifiantCandidature.formatter(),
              notifiéLeValue: notifiéeLe.formatter(),
              notifiéParValue: notifiéePar.formatter(),
              attestationValue: {
                format: 'application/pdf',
              },
            },
          });

          identifiantLauréats.push(identifiantCandidature);
        }

        if (candidature.statut?.estÉliminé()) {
          await mediator.send<Éliminé.NotifierÉliminéUseCase>({
            type: 'Éliminé.UseCase.NotifierÉliminé',
            data: {
              identifiantProjetValue: identifiantCandidature.formatter(),
              notifiéLeValue: notifiéeLe.formatter(),
              notifiéParValue: notifiéePar.formatter(),
              attestationValue: {
                format: 'application/pdf',
              },
            },
          });

          identifiantÉliminés.push(identifiantCandidature);
        }
      } catch (error) {
        getLogger().error(error as Error, { identifiantCandidature });
      }
    }

    const période = await loadPériode(identifiantPériode, false);
    await période.notifier({
      identifiantPériode,
      notifiéeLe,
      notifiéePar,
      identifiantLauréats,
      identifiantÉliminés,
    });
  };

  mediator.register('Période.Command.NotifierPériode', handler);
};
