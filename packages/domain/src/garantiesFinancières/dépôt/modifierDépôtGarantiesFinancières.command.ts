import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjetValueType } from '../../projet/projet.valueType';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { verifyGarantiesFinancièresTypeForCommand } from '../../projet/garantiesFinancières/verifyGarantiesFinancièresTypeForCommand';
import { verifyGarantiesFinancièresAttestationForCommand } from '../../projet/garantiesFinancières/verifyGarantiesFinancièresAttestationForCommand';
import {
  AttestationConstitution,
  TypeEtDateÉchéance,
  estTypeAvecDateÉchéance,
} from '../garantiesFinancières.valueType';
import { Utilisateur } from '../../domain.valueType';
import {
  createDépôtGarantiesFinancièresAggregateId,
  loadDépôtGarantiesFinancièresAggregateFactory,
} from '../garantiesFinancières.aggregate';
import { TéléverserFichierPort } from '../../common.ports';
import { isNone } from '@potentiel/monads';
import { DépôtGarantiesFinancièresModifiéV1 } from '../garantiesFinancières.event';
import { DépôtGarantiesFinancièresNonTrouvéPourModificationErreur } from '../garantiesFinancières.error';

export type ModifierDépôtGarantiesFinancièresCommand = Message<
  'MODIFIER_DÉPÔT_GARANTIES_FINANCIÈRES',
  {
    identifiantProjet: IdentifiantProjetValueType;
    attestationConstitution: AttestationConstitution;
    utilisateur: Utilisateur;
  } & TypeEtDateÉchéance
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
  const loadDépôtGarantiesFinancières = loadDépôtGarantiesFinancièresAggregateFactory({
    loadAggregate,
  });

  const handler: MessageHandler<ModifierDépôtGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    typeGarantiesFinancières,
    dateÉchéance,
    attestationConstitution,
    utilisateur,
  }) => {
    const agrégatDépôtGarantiesFinancières = await loadDépôtGarantiesFinancières(identifiantProjet);

    if (isNone(agrégatDépôtGarantiesFinancières) || !agrégatDépôtGarantiesFinancières.dépôt) {
      throw new DépôtGarantiesFinancièresNonTrouvéPourModificationErreur();
    }

    verifyGarantiesFinancièresTypeForCommand(typeGarantiesFinancières, dateÉchéance, utilisateur);

    verifyGarantiesFinancièresAttestationForCommand(attestationConstitution);

    await téléverserFichier({
      format: attestationConstitution.format,
      content: attestationConstitution.content,
      identifiantProjet: identifiantProjet.formatter(),
      type: 'depot-attestation-constitution-garanties-financieres',
    });

    const event: DépôtGarantiesFinancièresModifiéV1 = {
      type: 'DépôtGarantiesFinancièresModifié-v1',
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
      },
    };

    await publish(createDépôtGarantiesFinancièresAggregateId(identifiantProjet), event);
  };

  mediator.register('MODIFIER_DÉPÔT_GARANTIES_FINANCIÈRES', handler);
};
