import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjetValueType } from '../projet.valueType';
import { AttestationConstitution } from './garantiesFinancières.valueType';
import { Publish } from '@potentiel/core-domain';
import { createProjetAggregateId } from '../projet.aggregate';
import { verifyGarantiesFinancièresAttestationForCommand } from './verifyGarantiesFinancièresAttestationForCommand';
import { TéléverserFichierAttestationGarantiesFinancièresPort } from './garantiesFinancières.ports';
import { AttestationGarantiesFinancièresEnregistréeEvent } from './garantiesFinancières.event';
import { DateTimeValueType } from '../../common.valueType';

export type EnregistrerAttestationGarantiesFinancièresCommand = Message<
  'ENREGISTER_ATTESTATION_GARANTIES_FINANCIÈRES',
  {
    identifiantProjet: IdentifiantProjetValueType;
    attestationConstitution: AttestationConstitution;
    dateConstitution?: DateTimeValueType;
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
    verifyGarantiesFinancièresAttestationForCommand(attestationConstitution);

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
