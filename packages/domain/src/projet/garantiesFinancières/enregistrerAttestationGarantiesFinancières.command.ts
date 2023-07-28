import { Message, MessageHandler, mediator } from 'mediateur';
import { AttestationConstitution, IdentifiantProjetValueType } from '../projet.valueType';
import { Publish } from '@potentiel/core-domain';
import { createProjetAggregateId } from '../projet.aggregate';
import { AttestationGarantiesFinancièresEnregistréeEvent } from '../projet.event';
import { checkAttestation } from './checkAttestation';
import { TéléverserFichierAttestationGarantiesFinancièresPort } from './garantiesFinancières.ports';

export type EnregistrerAttestationGarantiesFinancièresCommand = Message<
  'ENREGISTER_ATTESTATION_GARANTIES_FINANCIÈRES',
  {
    identifiantProjet: IdentifiantProjetValueType;
    attestationConstitution: AttestationConstitution;
  }
>;

export type EnregistrerAttestationGarantiesFinancièresDependencies = {
  publish: Publish;
  téléverserFichier: TéléverserFichierAttestationGarantiesFinancièresPort;
};

export const registerEnregistrerAttestationGarantiesFinancièresCommand = ({
  publish,
  téléverserFichier,
}: EnregistrerAttestationGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<EnregistrerAttestationGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    attestationConstitution,
  }) => {
    checkAttestation(attestationConstitution);

    await téléverserFichier({
      attestationConstitution,
      identifiantProjet: identifiantProjet.formatter(),
      type: 'attestation-constitution-garanties-Financieres',
    });

    const event: AttestationGarantiesFinancièresEnregistréeEvent = {
      type: 'AttestationGarantiesFinancièresEnregistrée',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        format: attestationConstitution.format,
        date: attestationConstitution.date.formatter(),
      },
    };

    await publish(createProjetAggregateId(identifiantProjet), event);
  };

  mediator.register('ENREGISTER_ATTESTATION_GARANTIES_FINANCIÈRES', handler);
};
