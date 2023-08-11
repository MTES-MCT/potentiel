import { Message, MessageHandler, mediator } from 'mediateur';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import {
  TypeEtDateÉchéance,
  estTypeAvecDateÉchéance,
} from "../garantiesFinancières.valueType";
import { TypeGarantiesFinancièresEnregistréEventV1 } from './enregistrementGarantiesFinancières.event';
import { IdentifiantProjetValueType, Utilisateur } from '../../domain.valueType';
import { loadProjetAggregateFactory, createProjetAggregateId } from '../../projet/projet.aggregate';
import { verifyGarantiesFinancièresTypeForCommand } from '../verifyGarantiesFinancièresTypeForCommand';

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
