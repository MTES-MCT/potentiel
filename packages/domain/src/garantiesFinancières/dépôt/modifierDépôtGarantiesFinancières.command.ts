import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjetValueType } from '../../projet/projet.valueType';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { DateTimeValueType, Utilisateur } from '../../domain.valueType';
import {
  createGarantiesFinancièresAggregateId,
  loadGarantiesFinancièresAggregateFactory,
} from '../garantiesFinancières.aggregate';
import { TéléverserFichierPort } from '../../common.ports';
import { isNone } from '@potentiel/monads';
import {
  DateConstitutionGarantiesFinancièreDansLeFuturErreur,
  DateÉchéanceGarantiesFinancièresNonAcceptéeErreur,
  DateÉchéanceGarantiesFinancièresRequiseErreur,
  DépôtGarantiesFinancièresNonTrouvéErreur,
} from '../garantiesFinancières.error';
import { DépôtGarantiesFinancièresModifiéEventV1 } from './dépôtGarantiesFinancières.event';

export type ModifierDépôtGarantiesFinancièresCommand = Message<
  'MODIFIER_DÉPÔT_GARANTIES_FINANCIÈRES',
  {
    utilisateur: Utilisateur;
    identifiantProjet: IdentifiantProjetValueType;
    attestationConstitution: { format: string; date: DateTimeValueType; content: ReadableStream };
    dateModification: DateTimeValueType;
  } & (
    | { typeGarantiesFinancières: `avec date d'échéance`; dateÉchéance: DateTimeValueType }
    | { typeGarantiesFinancières: `consignation` | `6 mois après achèvement` }
  )
>;

export type ModifierDépôtGarantiesFinancièresDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
  téléverserFichier: TéléverserFichierPort;
};

export const registerModifierDépôtGarantiesFinancièresCommand = ({
  publish,
  loadAggregate,
  téléverserFichier,
}: ModifierDépôtGarantiesFinancièresDependencies) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresAggregateFactory({
    loadAggregate,
  });

  const handler: MessageHandler<ModifierDépôtGarantiesFinancièresCommand> = async (message) => {
    const {
      identifiantProjet,
      typeGarantiesFinancières,
      attestationConstitution,
      utilisateur,
      dateModification,
    } = message;

    const agrégatGarantiesFinancières = await loadGarantiesFinancières(identifiantProjet);

    if (isNone(agrégatGarantiesFinancières) || !agrégatGarantiesFinancières.dépôt) {
      throw new DépôtGarantiesFinancièresNonTrouvéErreur();
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

    const event: DépôtGarantiesFinancièresModifiéEventV1 = {
      type: 'DépôtGarantiesFinancièresModifié-v1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        dateModification: dateModification.formatter(),
        ...(typeGarantiesFinancières === "avec date d'échéance"
          ? {
              dateÉchéance: message.dateÉchéance!.formatter(),
              typeGarantiesFinancières,
            }
          : { typeGarantiesFinancières }),
        attestationConstitution: {
          format: attestationConstitution.format,
          date: attestationConstitution.date.formatter(),
        },
      },
    };

    await publish(createGarantiesFinancièresAggregateId(identifiantProjet), event);
  };

  mediator.register('MODIFIER_DÉPÔT_GARANTIES_FINANCIÈRES', handler);
};
