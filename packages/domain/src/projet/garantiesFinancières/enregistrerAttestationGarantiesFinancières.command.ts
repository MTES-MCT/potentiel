import { Message, MessageHandler, mediator } from 'mediateur';
import { AttestationGarantiesFinancières, IdentifiantProjetValueType } from '../projet.valueType';
import { Publish } from '@potentiel/core-domain';
import { createProjetAggregateId } from '../projet.aggregate';
import { AttestationGarantiesFinancièresEnregistréeEvent } from '../projet.event';
import { checkAttestation } from './checkAttestation';

export type EnregistrerAttestationGarantiesFinancièresCommand = Message<
  'ENREGISTER_ATTESTATION_GARANTIES_FINANCIÈRES',
  {
    identifiantProjet: IdentifiantProjetValueType;
    attestationGarantiesFinancières: AttestationGarantiesFinancières;
  }
>;

export type EnregistrerAttestationGarantiesFinancièresDependencies = { publish: Publish };

export const registerEnregistrerAttestationGarantiesFinancièresCommand = ({
  publish,
}: EnregistrerAttestationGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<EnregistrerAttestationGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    attestationGarantiesFinancières,
  }) => {
    checkAttestation(attestationGarantiesFinancières);

    const event: AttestationGarantiesFinancièresEnregistréeEvent = {
      type: 'AttestationGarantiesFinancièresEnregistrée',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        format: attestationGarantiesFinancières.format,
        dateConstitution: attestationGarantiesFinancières.dateConstitution.formatter(),
      },
    };

    await publish(createProjetAggregateId(identifiantProjet), event);
  };

  mediator.register('ENREGISTER_ATTESTATION_GARANTIES_FINANCIÈRES', handler);
};
