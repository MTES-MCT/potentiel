import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjetValueType } from '../../../projet.valueType';
import { createAbandonAggregateId, loadAbandonAggregateFactory } from '../abandon.aggregate';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { AbandonConfirméEvent } from '../abandon.event';
import { DateTimeValueType } from '../../../../common.valueType';
import {
  AucuneDemandeConfirmationAbandonError,
  DemandeAbandonInconnuErreur,
} from '../abandon.error';
import { IdentifiantUtilisateurValueType } from '../../../../utilisateur/utilisateur.valueType';

export type ConfirmerAbandonCommand = Message<
  'CONFIRMER_ABANDON_COMMAND',
  {
    identifiantProjet: IdentifiantProjetValueType;
    dateConfirmationAbandon: DateTimeValueType;
    confirméPar: IdentifiantUtilisateurValueType;
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

    if (abandon.getStatut() !== 'confirmation-demandé') {
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
