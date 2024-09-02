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
    candidats: ReadonlyArray<IdentifiantProjet.ValueType>;
  }
>;

export const registerNotifierPériodeCommand = (loadAggregate: LoadAggregate) => {
  const loadPériode = loadPériodeFactory(loadAggregate);
  const loadCandidature = Candidature.Aggregate.loadCandidatureFactory(loadAggregate);

  const handler: MessageHandler<NotifierPériodeCommand> = async ({
    identifiantPériode,
    notifiéeLe,
    notifiéePar,
    candidats,
  }) => {
    const lauréats: Array<IdentifiantProjet.ValueType> = [];
    const éliminés: Array<IdentifiantProjet.ValueType> = [];

    for (const candidat of candidats) {
      const candidature = await loadCandidature(candidat);

      try {
        if (candidature.statut?.estClassé()) {
          await mediator.send<Lauréat.NotifierLauréatUseCase>({
            type: 'Lauréat.UseCase.NotifierLauréat',
            data: {
              identifiantProjetValue: candidat.formatter(),
              notifiéLeValue: notifiéeLe.formatter(),
              notifiéParValue: notifiéePar.formatter(),
              attestationValue: {
                format: 'application/pdf',
              },
            },
          });

          lauréats.push(candidat);
        }

        if (candidature.statut?.estÉliminé()) {
          await mediator.send<Éliminé.NotifierÉliminéUseCase>({
            type: 'Éliminé.UseCase.NotifierÉliminé',
            data: {
              identifiantProjetValue: candidat.formatter(),
              notifiéLeValue: notifiéeLe.formatter(),
              notifiéParValue: notifiéePar.formatter(),
              attestationValue: {
                format: 'application/pdf',
              },
            },
          });

          éliminés.push(candidat);
        }
      } catch (error) {
        getLogger().error(error as Error, { candidat });
      }
    }

    const période = await loadPériode(identifiantPériode, false);
    await période.notifier({ identifiantPériode, notifiéeLe, notifiéePar, lauréats, éliminés });
  };

  mediator.register('Période.Command.NotifierPériode', handler);
};
