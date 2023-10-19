import { Message, MessageHandler, mediator } from 'mediateur';
import { createAbandonAggregateId, loadAbandonAggregateFactory } from '../abandon.aggregate';
import { LoadAggregate, Publish } from '@potentiel-domain/core';
import { isNone } from '@potentiel/monads';
import { AbandonAnnuléEvent } from '../abandon.event';
import { AbandonDéjàAccordéError, AbandonInconnuErreur } from '../abandon.error';
import { IdentifiantProjet, IdentifiantUtilisateur, DateTime } from '@potentiel-domain/common';

export type AnnulerAbandonCommand = Message<
  'ANNULER_ABANDON_COMMAND',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateAnnulationAbandon: DateTime.ValueType;
    annuléPar: IdentifiantUtilisateur.ValueType;
  }
>;

export type AnnulerAbandonDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
};

export const registerAnnulerAbandonCommand = ({
  loadAggregate,
  publish,
}: AnnulerAbandonDependencies) => {
  const loadAbandonAggregate = loadAbandonAggregateFactory({ loadAggregate });
  const handler: MessageHandler<AnnulerAbandonCommand> = async ({
    identifiantProjet,
    dateAnnulationAbandon,
    annuléPar,
  }) => {
    const abandon = await loadAbandonAggregate(identifiantProjet);

    if (isNone(abandon)) {
      throw new AbandonInconnuErreur();
    }

    if (abandon.estAccordé()) {
      throw new AbandonDéjàAccordéError();
    }

    const event: AbandonAnnuléEvent = {
      type: 'AbandonAnnulé-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        annuléLe: dateAnnulationAbandon.formatter(),
        annuléPar: annuléPar.formatter(),
      },
    };

    await publish(createAbandonAggregateId(identifiantProjet), event);
  };
  mediator.register('ANNULER_ABANDON_COMMAND', handler);
};
