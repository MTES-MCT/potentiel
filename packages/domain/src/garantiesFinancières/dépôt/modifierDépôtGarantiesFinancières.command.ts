import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjetValueType } from '../../projet/projet.valueType';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { verifyGarantiesFinancièresTypeForCommand } from '../verifyGarantiesFinancièresTypeForCommand';
import { verifyGarantiesFinancièresAttestationForCommand } from '../verifyGarantiesFinancièresAttestationForCommand';
import {
  AttestationConstitution,
  TypeEtDateÉchéance,
  estTypeAvecDateÉchéance,
} from '../garantiesFinancières.valueType';
import { Utilisateur } from '../../domain.valueType';
import {
  createGarantiesFinancièresAggregateId,
  loadGarantiesFinancièresAggregateFactory,
} from '../garantiesFinancières.aggregate';
import { TéléverserFichierPort } from '../../common.ports';
import { isNone } from '@potentiel/monads';
import { DépôtGarantiesFinancièresNonTrouvéPourModificationErreur } from '../garantiesFinancières.error';
import { DépôtGarantiesFinancièresModifiéEvent } from './dépôtGarantiesFinancières.event';

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
  const loadGarantiesFinancières = loadGarantiesFinancièresAggregateFactory({
    loadAggregate,
  });

  const handler: MessageHandler<ModifierDépôtGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    typeGarantiesFinancières,
    dateÉchéance,
    attestationConstitution,
    utilisateur,
  }) => {
    const agrégatGarantiesFinancières = await loadGarantiesFinancières(identifiantProjet);

    if (isNone(agrégatGarantiesFinancières) || !agrégatGarantiesFinancières.dépôt) {
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

    const event: DépôtGarantiesFinancièresModifiéEvent = {
      type: 'DépôtGarantiesFinancièresModifié',
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

    await publish(createGarantiesFinancièresAggregateId(identifiantProjet), event);
  };

  mediator.register('MODIFIER_DÉPÔT_GARANTIES_FINANCIÈRES', handler);
};
