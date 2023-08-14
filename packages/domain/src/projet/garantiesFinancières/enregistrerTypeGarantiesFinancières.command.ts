import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjetValueType } from '../projet.valueType';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { createProjetAggregateId, loadProjetAggregateFactory } from '../projet.aggregate';
import { verifyGarantiesFinancièresTypeForCommand } from './verifyGarantiesFinancièresTypeForCommand';
import {
  TypeEtDateÉchéance,
  estTypeAvecDateÉchéance,
} from '../../garantiesFinancières/garantiesFinancières.valueType';
import { TypeGarantiesFinancièresEnregistréEventV1 } from './garantiesFinancières.event';
import { Utilisateur } from '../../domain.valueType';

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
  const loadProjet = loadProjetAggregateFactory({
    loadAggregate,
  });

  const handler: MessageHandler<EnregistrerTypeGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    typeGarantiesFinancières,
    dateÉchéance,
    utilisateur,
  }) => {
    const agrégatProjet = await loadProjet(identifiantProjet);

    verifyGarantiesFinancièresTypeForCommand(
      typeGarantiesFinancières,
      dateÉchéance,
      utilisateur,
      agrégatProjet,
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

    await publish(createProjetAggregateId(identifiantProjet), event);
  };

  mediator.register('ENREGISTER_TYPE_GARANTIES_FINANCIÈRES', handler);
};
