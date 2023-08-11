import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjetValueType } from '../../projet/projet.valueType';
import { AttestationConstitution } from '../garantiesFinancières.valueType';
import { Publish } from '@potentiel/core-domain';
import { createProjetAggregateId } from '../../projet/projet.aggregate';
import { verifyGarantiesFinancièresAttestationForCommand } from '../verifyGarantiesFinancièresAttestationForCommand';
import { AttestationGarantiesFinancièresEnregistréeEvent } from './enregistrementGarantiesFinancières.event';
import { TéléverserFichierPort } from '../../common.ports';

export type EnregistrerAttestationGarantiesFinancièresCommand = Message<
  'ENREGISTER_ATTESTATION_GARANTIES_FINANCIÈRES',
  {
    identifiantProjet: IdentifiantProjetValueType;
    attestationConstitution: AttestationConstitution;
  }
>;

export type EnregistrerAttestationGarantiesFinancièresDependencies = {
  publish: Publish;
  téléverserFichier: TéléverserFichierPort;
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
      content: attestationConstitution.content,
      format: attestationConstitution.format,
      identifiantProjet: identifiantProjet.formatter(),
      type: 'attestation-constitution-garanties-financieres',
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
