import { Message, MessageHandler, mediator } from 'mediateur';
import { isNone } from '@potentiel/monads';
import { LoadAggregate, Publish } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';
import { AbandonConfirméEvent } from '../abandon.event';
import { createAbandonAggregateId, loadAbandonAggregateFactory } from '../abandon.aggregate';
import {
  AucuneDemandeConfirmationAbandonError,
  DemandeAbandonInconnuErreur,
} from '../abandon.error';

export type ConfirmerAbandonCommand = Message<
  'CONFIRMER_ABANDON_COMMAND',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateConfirmationAbandon: DateTime.ValueType;
    confirméPar: IdentifiantUtilisateur.ValueType;
  }
>;

export type ConfirmerAbandonDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
};

export const registerConfirmerAbandonCommand = ({
  loadAggregate,
  publish,
}: ConfirmerAbandonDependencies) => {
  const loadAbandonAggregate = loadAbandonAggregateFactory({ loadAggregate });
  const handler: MessageHandler<ConfirmerAbandonCommand> = async ({
    identifiantProjet,
    dateConfirmationAbandon,
    confirméPar,
  }) => {
    const abandon = await loadAbandonAggregate(identifiantProjet);

    if (isNone(abandon)) {
      throw new DemandeAbandonInconnuErreur();
    }

    if (!abandon.estEnAttenteConfirmation()) {
      throw new AucuneDemandeConfirmationAbandonError();
    }

    const event: AbandonConfirméEvent = {
      type: 'AbandonConfirmé-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        confirméLe: dateConfirmationAbandon.formatter(),
        confirméPar: confirméPar.formatter(),
      },
    };

    await publish(createAbandonAggregateId(identifiantProjet), event);
  };
  mediator.register('CONFIRMER_ABANDON_COMMAND', handler);
};
