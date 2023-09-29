import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjetValueType } from '../../../projet.valueType';
import { createAbandonAggregateId, loadAbandonAggregateFactory } from '../abandon.aggregate';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { DateTimeValueType } from '../../../../common.valueType';
import { AbandonAnnuléEvent } from '../abandon.event';
import { DemandeAbandonInconnuErreur } from '../abandon.error';

export type AnnulerAbandonCommand = Message<
  'ANNULER_ABANDON_COMMAND',
  {
    identifiantProjet: IdentifiantProjetValueType;
    dateAnnulationAbandon: DateTimeValueType;
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
  }) => {
    const abandon = await loadAbandonAggregate(identifiantProjet);

    if (isNone(abandon)) {
      throw new DemandeAbandonInconnuErreur();
    }

    const event: AbandonAnnuléEvent = {
      type: 'AbandonAnnulé-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        annuléLe: dateAnnulationAbandon.formatter(),
      },
    };

    await publish(createAbandonAggregateId(identifiantProjet), event);
  };
  mediator.register('ANNULER_ABANDON_COMMAND', handler);
};
