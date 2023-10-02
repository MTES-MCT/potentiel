import { Message, MessageHandler, mediator } from 'mediateur';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { DateTimeValueType, IdentifiantProjetValueType } from '../../domain.valueType';
import {
  createGarantiesFinancièresAggregateId,
  loadGarantiesFinancièresAggregateFactory,
} from '../garantiesFinancières.aggregate';
import {
  DateÉchéanceGarantiesFinancièresNonAcceptéeErreur,
  DateÉchéanceGarantiesFinancièresRequiseErreur,
} from '../garantiesFinancières.error';
import { isSome } from '@potentiel/monads';
import { TypeGarantiesFinancièresImportéEventV1 } from './enregistrementGarantiesFinancières.event';

export type ImporterTypeGarantiesFinancièresCommand = Message<
  'IMPORTER_TYPE_GARANTIES_FINANCIÈRES',
  {
    identifiantProjet: IdentifiantProjetValueType;
  } & (
    | { typeGarantiesFinancières: `avec date d'échéance`; dateÉchéance: DateTimeValueType }
    | { typeGarantiesFinancières: `consignation` | `6 mois après achèvement` }
  )
>;

export type ImporterTypeGarantiesFinancièresDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
};

export const registerImporterTypeGarantiesFinancièresCommand = ({
  publish,
  loadAggregate,
}: ImporterTypeGarantiesFinancièresDependencies) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresAggregateFactory({
    loadAggregate,
  });

  const handler: MessageHandler<ImporterTypeGarantiesFinancièresCommand> = async (message) => {
    const { identifiantProjet, typeGarantiesFinancières } = message;
    const agrégatGarantiesFinancières = await loadGarantiesFinancières(identifiantProjet);

    if (isSome(agrégatGarantiesFinancières) && agrégatGarantiesFinancières.actuelles) {
      //TODO : logguer erreur > il ne devrait pas y avoir de GF sur le projet lorsqu'il est importé
    }

    if ('dateÉchéance' in message && typeGarantiesFinancières !== "avec date d'échéance") {
      throw new DateÉchéanceGarantiesFinancièresNonAcceptéeErreur();
    }

    if (!('dateÉchéance' in message) && typeGarantiesFinancières === "avec date d'échéance") {
      throw new DateÉchéanceGarantiesFinancièresRequiseErreur();
    }

    const event: TypeGarantiesFinancièresImportéEventV1 = {
      type: 'TypeGarantiesFinancièresImporté-v1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        ...(typeGarantiesFinancières === "avec date d'échéance"
          ? {
              dateÉchéance: message.dateÉchéance.formatter(),
              typeGarantiesFinancières,
            }
          : { typeGarantiesFinancières }),
      },
    };

    await publish(createGarantiesFinancièresAggregateId(identifiantProjet), event);
  };

  mediator.register('IMPORTER_TYPE_GARANTIES_FINANCIÈRES', handler);
};
