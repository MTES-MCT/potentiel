import { Message, MessageHandler, mediator } from 'mediateur';
import { LoadAggregate, Publish } from '@potentiel/core-domain';

import { GarantiesFinancièresEnregistréesEventV1 } from './enregistrementGarantiesFinancières.event';
import { DateTimeValueType, IdentifiantProjetValueType, Utilisateur } from '../../domain.valueType';
import { TéléverserFichierPort } from '../../common.ports';
import {
  createGarantiesFinancièresAggregateId,
  loadGarantiesFinancièresAggregateFactory,
} from '../garantiesFinancières.aggregate';
import {
  DateConstitutionGarantiesFinancièreDansLeFuturErreur,
  DateÉchéanceGarantiesFinancièresNonAcceptéeErreur,
  DateÉchéanceGarantiesFinancièresRequiseErreur,
  EnregistrementGarantiesFinancièresImpossibleCarDépôtAttenduErreur,
  ModificationGarantiesFinancièresNonAutoriséeErreur,
  TypeGarantiesFinancièresNonAcceptéErreur,
} from '../garantiesFinancières.error';
import { isSome } from '@potentiel/monads';

export type EnregistrerGarantiesFinancièresCommand = Message<
  'ENREGISTER_GARANTIES_FINANCIÈRES',
  {
    utilisateur: Utilisateur;
    identifiantProjet: IdentifiantProjetValueType;
    attestationConstitution: { format: string; date: DateTimeValueType; content: ReadableStream };
  } & (
    | { typeGarantiesFinancières: `avec date d'échéance`; dateÉchéance: DateTimeValueType }
    | { typeGarantiesFinancières: `consignation` | `6 mois après achèvement` }
  )
>;

export type EnregistrerGarantiesFinancièresDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
  téléverserFichier: TéléverserFichierPort;
};

export const registerEnregistrerGarantiesFinancièresCommand = ({
  publish,
  loadAggregate,
  téléverserFichier,
}: EnregistrerGarantiesFinancièresDependencies) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresAggregateFactory({
    loadAggregate,
  });
  const handler: MessageHandler<EnregistrerGarantiesFinancièresCommand> = async (message) => {
    const { identifiantProjet, typeGarantiesFinancières, attestationConstitution, utilisateur } =
      message;

    const agrégatGarantiesFinancières = await loadGarantiesFinancières(identifiantProjet);

    if (utilisateur.rôle === 'porteur-projet' && isSome(agrégatGarantiesFinancières)) {
      if (agrégatGarantiesFinancières.dateLimiteDépôt) {
        throw new EnregistrementGarantiesFinancièresImpossibleCarDépôtAttenduErreur();
      }

      if (
        agrégatGarantiesFinancières.actuelles?.typeGarantiesFinancières &&
        agrégatGarantiesFinancières.actuelles?.typeGarantiesFinancières !== typeGarantiesFinancières
      ) {
        throw new ModificationGarantiesFinancièresNonAutoriséeErreur();
      }
    }

    if (
      !['consignation', '6 mois après achèvement', "avec date d'échéance"].includes(
        typeGarantiesFinancières,
      )
    ) {
      throw new TypeGarantiesFinancièresNonAcceptéErreur();
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
      content: attestationConstitution.content,
      format: attestationConstitution.format,
      identifiantProjet: identifiantProjet.formatter(),
      type: 'attestation-constitution-garanties-financieres',
    });

    const event: GarantiesFinancièresEnregistréesEventV1 = {
      type: 'GarantiesFinancièresEnregistrées-v1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        attestationConstitution: {
          format: attestationConstitution.format,
          date: attestationConstitution.date.formatter(),
        },
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

  mediator.register('ENREGISTER_GARANTIES_FINANCIÈRES', handler);
};
