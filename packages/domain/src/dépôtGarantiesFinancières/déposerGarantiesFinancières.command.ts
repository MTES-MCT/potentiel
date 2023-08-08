import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjetValueType } from '../projet/projet.valueType';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
//import { verifyGarantiesFinancièresTypeForCommand } from '../projet/garantiesFinancières/verifyGarantiesFinancièresTypeForCommand';
import { verifyGarantiesFinancièresAttestationForCommand } from '../projet/garantiesFinancières/verifyGarantiesFinancièresAttestationForCommand';
import {
  AttestationConstitution,
  TypeEtDateÉchéance,
  estTypeAvecDateÉchéance,
} from '../projet/garantiesFinancières/garantiesFinancières.valueType';
import { DateTimeValueType, Utilisateur } from '../domain.valueType';
import {
  createDépôtGarantiesFinancièresAggregateId,
  //loadDépôtGarantiesFinancièresAggregateFactory,
} from './dépôtGarantiesFinancières.aggregate';
import { GarantiesFinancièresDéposéesV1 } from './dépôtGarantiesFinancières.event';
import { TéléverserFichierPort } from '../common.ports';

export type DéposerGarantiesFinancièresCommand = Message<
  'DÉPOSER_GARANTIES_FINANCIÈRES',
  {
    identifiantProjet: IdentifiantProjetValueType;
    attestationConstitution: AttestationConstitution;
    utilisateur: Utilisateur;
    dateDépôt: DateTimeValueType;
  } & TypeEtDateÉchéance
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
  // const loadDépôtGarantiesFinancières = loadDépôtGarantiesFinancièresAggregateFactory({
  //   loadAggregate,
  // });

  const handler: MessageHandler<DéposerGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    typeGarantiesFinancières,
    dateÉchéance,
    attestationConstitution,
    dateDépôt,
    utilisateur,
  }) => {
    // const agrégatDépôtGarantiesFinancières = await loadDépôtGarantiesFinancières(identifiantProjet);

    // verifyGarantiesFinancièresTypeForCommand(
    //   typeGarantiesFinancières,
    //   dateÉchéance,
    //   utilisateur,
    //   agrégatProjet,
    // );

    verifyGarantiesFinancièresAttestationForCommand(attestationConstitution);

    await téléverserFichier({
      format: attestationConstitution.format,
      content: attestationConstitution.content,
      identifiantProjet: identifiantProjet.formatter(),
      type: 'depot-attestation-constitution-garanties-financieres',
    });

    const event: GarantiesFinancièresDéposéesV1 = {
      type: 'GarantiesFinancièresDéposées-v1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        ...(estTypeAvecDateÉchéance(typeGarantiesFinancières)
          ? {
              dateÉchéance: dateÉchéance!.formatter(),
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

    await publish(createDépôtGarantiesFinancièresAggregateId(identifiantProjet), event);
  };

  mediator.register('DÉPOSER_GARANTIES_FINANCIÈRES', handler);
};
