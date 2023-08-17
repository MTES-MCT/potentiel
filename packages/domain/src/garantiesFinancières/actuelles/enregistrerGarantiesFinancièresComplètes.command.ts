import { Message, MessageHandler, mediator } from 'mediateur';
import { LoadAggregate, Publish } from '@potentiel/core-domain';

import {
  AttestationConstitution,
  TypeEtDateÉchéance,
  estTypeAvecDateÉchéance,
} from '../garantiesFinancières.valueType';
import {
  AttestationGarantiesFinancièresEnregistréeEventV1,
  TypeGarantiesFinancièresEnregistréEventV1,
} from './enregistrementGarantiesFinancières.event';
import { IdentifiantProjetValueType, Utilisateur } from '../../domain.valueType';
import { TéléverserFichierPort } from '../../common.ports';
import { verifyGarantiesFinancièresAttestationForCommand } from '../verifyGarantiesFinancièresAttestationForCommand';
import { verifyGarantiesFinancièresTypeForCommand } from '../verifyGarantiesFinancièresTypeForCommand';
import {
  createGarantiesFinancièresAggregateId,
  loadGarantiesFinancièresAggregateFactory,
} from '../garantiesFinancières.aggregate';

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

    const eventForType: TypeGarantiesFinancièresEnregistréEventV1 = {
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

    await publish(createGarantiesFinancièresAggregateId(identifiantProjet), eventForType);

    const eventForAttestation: AttestationGarantiesFinancièresEnregistréeEventV1 = {
      type: 'AttestationGarantiesFinancièresEnregistrée-v1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        format: attestationConstitution.format,
        date: attestationConstitution.date.formatter(),
      },
    };

    setTimeout(
      async () =>
        await publish(
          createGarantiesFinancièresAggregateId(identifiantProjet),
          eventForAttestation,
        ),
      100,
    );
  };

  mediator.register('ENREGISTER_GARANTIES_FINANCIÈRES_COMPLÈTES', handler);
};
