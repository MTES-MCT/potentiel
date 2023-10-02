import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjetValueType } from '../../projet/projet.valueType';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { DateTimeValueType } from '../../domain.valueType';
import {
  createGarantiesFinancièresAggregateId,
  loadGarantiesFinancièresAggregateFactory,
} from '../garantiesFinancières.aggregate';
import { TéléverserFichierPort } from '../../common.ports';
import { isSome } from '@potentiel/monads';
import {
  DateConstitutionGarantiesFinancièreDansLeFuturErreur,
  DateÉchéanceGarantiesFinancièresNonAcceptéeErreur,
  DateÉchéanceGarantiesFinancièresRequiseErreur,
  DépôtGarantiesFinancièresDéjàExistantErreur,
} from '../garantiesFinancières.error';
import { GarantiesFinancièresDéposéesEventV1 } from './dépôtGarantiesFinancières.event';

export type DéposerGarantiesFinancièresCommand = Message<
  'DÉPOSER_GARANTIES_FINANCIÈRES',
  {
    identifiantProjet: IdentifiantProjetValueType;
    attestationConstitution: { format: string; date: DateTimeValueType; content: ReadableStream };
    dateDépôt: DateTimeValueType;
  } & (
    | { typeGarantiesFinancières: `avec date d'échéance`; dateÉchéance: DateTimeValueType }
    | { typeGarantiesFinancières: `consignation` | `6 mois après achèvement` }
  )
>;

export type DéposerGarantiesFinancièresDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
  téléverserFichier: TéléverserFichierPort;
};

export const registerDéposerGarantiesFinancièresCommand = ({
  publish,
  loadAggregate,
  téléverserFichier,
}: DéposerGarantiesFinancièresDependencies) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresAggregateFactory({
    loadAggregate,
  });

  const handler: MessageHandler<DéposerGarantiesFinancièresCommand> = async (message) => {
    const { identifiantProjet, typeGarantiesFinancières, attestationConstitution, dateDépôt } =
      message;

    const agrégatGarantiesFinancières = await loadGarantiesFinancières(identifiantProjet);
    if (
      isSome(agrégatGarantiesFinancières) &&
      agrégatGarantiesFinancières.dépôt?.attestationConstitution
    ) {
      throw new DépôtGarantiesFinancièresDéjàExistantErreur();
    }

    if ('dateÉchéance' in message && typeGarantiesFinancières !== "avec date d'échéance") {
      throw new DateÉchéanceGarantiesFinancièresNonAcceptéeErreur();
    }

    if (!('dateÉchéance' in message) && typeGarantiesFinancières === "avec date d'échéance") {
      throw new DateÉchéanceGarantiesFinancièresRequiseErreur();
    }

    if (attestationConstitution.date.estDansLeFutur()) {
      throw new DateConstitutionGarantiesFinancièreDansLeFuturErreur();
    }

    await téléverserFichier({
      format: attestationConstitution.format,
      content: attestationConstitution.content,
      identifiantProjet: identifiantProjet.formatter(),
      type: 'depot-attestation-constitution-garanties-financieres',
    });

    const event: GarantiesFinancièresDéposéesEventV1 = {
      type: 'GarantiesFinancièresDéposées-v1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        ...(typeGarantiesFinancières === "avec date d'échéance"
          ? {
              dateÉchéance: message.dateÉchéance.formatter(),
              typeGarantiesFinancières,
            }
          : { typeGarantiesFinancières }),
        attestationConstitution: {
          format: attestationConstitution.format,
          date: attestationConstitution.date.formatter(),
        },
        dateDépôt: dateDépôt.formatter(),
      },
    };

    await publish(createGarantiesFinancièresAggregateId(identifiantProjet), event);
  };

  mediator.register('DÉPOSER_GARANTIES_FINANCIÈRES', handler);
};
