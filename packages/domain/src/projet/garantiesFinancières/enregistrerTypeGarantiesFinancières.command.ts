import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjetValueType, TypeEtDateÉchéance } from '../projet.valueType';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { createProjetAggregateId, loadProjetAggregateFactory } from '../projet.aggregate';
import { TypeGarantiesFinancièresEnregistréEvent } from '../projet.event';
import { checkType } from './checkType';

export type EnregistrerTypeGarantiesFinancièresCommand = Message<
  'ENREGISTER_TYPE_GARANTIES_FINANCIÈRES',
  {
    identifiantProjet: IdentifiantProjetValueType;
    currentUserRôle: 'admin' | 'porteur-projet' | 'dgec-validateur' | 'cre' | 'caisse-des-dépôts';
  } & TypeEtDateÉchéance
>;

export type EnregistrerTypeGarantiesFinancièresDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
};

export const registerEnregistrerTypeGarantiesFinancièresCommand = ({
  publish,
  loadAggregate,
}: EnregistrerTypeGarantiesFinancièresDependencies) => {
  const loadProjet = loadProjetAggregateFactory({
    loadAggregate,
  });

  const handler: MessageHandler<EnregistrerTypeGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    typeGarantiesFinancières,
    dateÉchéance,
    currentUserRôle,
  }) => {
    const agrégatProjet = await loadProjet(identifiantProjet);

    checkType(typeGarantiesFinancières, dateÉchéance, currentUserRôle, agrégatProjet);

    const event: TypeGarantiesFinancièresEnregistréEvent = {
      type: 'TypeGarantiesFinancièresEnregistré',
      payload: {
        typeGarantiesFinancières,
        ...(dateÉchéance && {
          dateÉchéance: dateÉchéance.formatter(),
        }),
        identifiantProjet: identifiantProjet.formatter(),
      },
    };

    await publish(createProjetAggregateId(identifiantProjet), event);
  };

  mediator.register('ENREGISTER_TYPE_GARANTIES_FINANCIÈRES', handler);
};
