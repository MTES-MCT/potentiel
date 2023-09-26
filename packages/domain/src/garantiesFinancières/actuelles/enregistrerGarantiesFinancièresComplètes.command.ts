import { Message, MessageHandler, mediator } from 'mediateur';
import { LoadAggregate, Publish } from '@potentiel/core-domain';

import {
  AttestationConstitution,
  TypeEtDateÉchéance,
  estTypeAvecDateÉchéance,
} from '../garantiesFinancières.valueType';
import { GarantiesFinancièresComplètesEnregistréesEventV1 } from './enregistrementGarantiesFinancières.event';
import { IdentifiantProjetValueType, Utilisateur } from '../../domain.valueType';
import { TéléverserFichierPort } from '../../common.ports';
import { verifyGarantiesFinancièresAttestationForCommand } from '../verifyGarantiesFinancièresAttestationForCommand';
import { verifyGarantiesFinancièresTypeForCommand } from '../verifyGarantiesFinancièresTypeForCommand';
import {
  createGarantiesFinancièresAggregateId,
  loadGarantiesFinancièresAggregateFactory,
} from '../garantiesFinancières.aggregate';
import { EnregistrementGarantiesFinancièresImpossibleCarDépôtAttenduErreur } from '../garantiesFinancières.error';
import { isSome } from '@potentiel/monads';

export type EnregistrerGarantiesFinancièresComplètesCommand = Message<
  'ENREGISTER_GARANTIES_FINANCIÈRES_COMPLÈTES',
  {
    identifiantProjet: IdentifiantProjetValueType;
    attestationConstitution: AttestationConstitution;
    utilisateur: Utilisateur;
  } & TypeEtDateÉchéance
>;

export type EnregistrerGarantiesFinancièresComplètesDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
  téléverserFichier: TéléverserFichierPort;
};

export const registerEnregistrerGarantiesFinancièresComplètesCommand = ({
  publish,
  loadAggregate,
  téléverserFichier,
}: EnregistrerGarantiesFinancièresComplètesDependencies) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresAggregateFactory({
    loadAggregate,
  });
  const handler: MessageHandler<EnregistrerGarantiesFinancièresComplètesCommand> = async ({
    identifiantProjet,
    typeGarantiesFinancières,
    dateÉchéance,
    attestationConstitution,
    utilisateur,
  }) => {
    const agrégatGarantiesFinancières = await loadGarantiesFinancières(identifiantProjet);

    if (
      utilisateur.rôle === 'porteur-projet' &&
      isSome(agrégatGarantiesFinancières) &&
      agrégatGarantiesFinancières.dateLimiteDépôt
    ) {
      throw new EnregistrementGarantiesFinancièresImpossibleCarDépôtAttenduErreur();
    }

    verifyGarantiesFinancièresTypeForCommand(
      typeGarantiesFinancières,
      dateÉchéance,
      utilisateur,
      agrégatGarantiesFinancières,
    );

    verifyGarantiesFinancièresAttestationForCommand(attestationConstitution);

    await téléverserFichier({
      content: attestationConstitution.content,
      format: attestationConstitution.format,
      identifiantProjet: identifiantProjet.formatter(),
      type: 'attestation-constitution-garanties-financieres',
    });

    const event: GarantiesFinancièresComplètesEnregistréesEventV1 = {
      type: 'GarantiesFinancièresComplètesEnregistréesEvent-v1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        attestationConstitution: {
          format: attestationConstitution.format,
          date: attestationConstitution.date.formatter(),
        },
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

  mediator.register('ENREGISTER_GARANTIES_FINANCIÈRES_COMPLÈTES', handler);
};
