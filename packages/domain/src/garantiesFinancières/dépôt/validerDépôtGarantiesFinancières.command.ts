import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjetValueType } from '../../projet/projet.valueType';
import { Publish } from '@potentiel/core-domain';
import {
  createGarantiesFinancièresAggregateId,
} from '../garantiesFinancières.aggregate';
import { DépôtGarantiesFinancièresValidéEventV1 } from './dépôtGarantiesFinancières.event';

export type ValiderDépôtGarantiesFinancièresCommand = Message<
  'VALIDER_DÉPÔT_GARANTIES_FINANCIÈRES',
  {
    identifiantProjet: IdentifiantProjetValueType;
  }
>;

export type ValiderDépôtarantiesFinancièresDependencies = {
  publish: Publish;
};

export const registerValiderDépôtGarantiesFinancièresCommand = ({
  publish,
}: ValiderDépôtarantiesFinancièresDependencies) => {
  const handler: MessageHandler<ValiderDépôtGarantiesFinancièresCommand> = async ({
    identifiantProjet,
  }) => {
    const event: DépôtGarantiesFinancièresValidéEventV1 = {
      type: 'DépôtGarantiesFinancièresValidé-v1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    };

    await publish(createGarantiesFinancièresAggregateId(identifiantProjet), event);
  };

  mediator.register('VALIDER_DÉPÔT_GARANTIES_FINANCIÈRES', handler);
};
