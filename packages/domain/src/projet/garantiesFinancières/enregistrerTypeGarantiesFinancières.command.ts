import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjetValueType, TypeGarantiesFinancières } from '../projet.valueType';
import { Publish } from '@potentiel/core-domain';
import { createProjetAggregateId } from '../projet.aggregate';
import { TypeGarantiesFinancièresEnregistréEvent } from '../projet.event';

export type EnregistrerTypeGarantiesFinancièresCommand = Message<
  'ENREGISTER_TYPE_GARANTIES_FINANCIÈRES',
  {
    identifiantProjet: IdentifiantProjetValueType;
    typeGarantiesFinancières: TypeGarantiesFinancières;
  }
>;

export type EnregistrerTypeGarantiesFinancièresDependencies = { publish: Publish };

export const registerEnregistrerTypeGarantiesFinancièresCommand = ({
  publish,
}: EnregistrerTypeGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<EnregistrerTypeGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    typeGarantiesFinancières,
  }) => {
    const event: TypeGarantiesFinancièresEnregistréEvent = {
      type: 'TypeGarantiesFinancièresEnregistré',
      payload: {
        type: typeGarantiesFinancières.type,
        ...(typeGarantiesFinancières.dateÉchéance && {
          dateÉchéance: typeGarantiesFinancières.dateÉchéance.formatter(),
        }),
        identifiantProjet: identifiantProjet.formatter(),
      },
    };

    await publish(createProjetAggregateId(identifiantProjet), event);
  };

  mediator.register('ENREGISTER_TYPE_GARANTIES_FINANCIÈRES', handler);
};
