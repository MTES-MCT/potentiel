import { Message, MessageHandler, mediator } from 'mediateur';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { TypeEtDateÉchéance, estTypeAvecDateÉchéance } from '../garantiesFinancières.valueType';
import { TypeGarantiesFinancièresEnregistréEventV1 } from './enregistrementGarantiesFinancières.event';
import { IdentifiantProjetValueType, Utilisateur } from '../../domain.valueType';
import { verifyGarantiesFinancièresTypeForCommand } from '../verifyGarantiesFinancièresTypeForCommand';
import {
  createGarantiesFinancièresAggregateId,
  loadGarantiesFinancièresAggregateFactory,
} from '../garantiesFinancières.aggregate';

export type EnregistrerTypeGarantiesFinancièresCommand = Message<
  'ENREGISTER_TYPE_GARANTIES_FINANCIÈRES',
  {
    identifiantProjet: IdentifiantProjetValueType;
    utilisateur: Utilisateur;
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
  const loadGarantiesFinancières = loadGarantiesFinancièresAggregateFactory({
    loadAggregate,
  });

  const handler: MessageHandler<EnregistrerTypeGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    typeGarantiesFinancières,
    dateÉchéance,
    utilisateur,
  }) => {
    const agrégatGarantiesFinancières = await loadGarantiesFinancières(identifiantProjet);

    verifyGarantiesFinancièresTypeForCommand(
      typeGarantiesFinancières,
      dateÉchéance,
      utilisateur,
      agrégatGarantiesFinancières,
    );

    const event: TypeGarantiesFinancièresEnregistréEventV1 = {
      type: 'TypeGarantiesFinancièresEnregistré-v1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        ...(estTypeAvecDateÉchéance(typeGarantiesFinancières)
          ? {
              dateÉchéance: dateÉchéance!.formatter(),
              typeGarantiesFinancières,
            }
          : { typeGarantiesFinancières }),
      },
    };

    await publish(createGarantiesFinancièresAggregateId(identifiantProjet), event);
  };

  mediator.register('ENREGISTER_TYPE_GARANTIES_FINANCIÈRES', handler);
};
