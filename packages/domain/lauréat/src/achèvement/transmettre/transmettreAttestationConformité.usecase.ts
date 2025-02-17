import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { TypeDocumentAchèvement } from '..';
import { AnnulerTâchesPlanifiéesGarantiesFinancièresCommand } from '../../garantiesFinancières/tâches-planifiées/annuler/annuler.command';

import { TransmettreAttestationConformitéCommand } from './transmettreAttestationConformité.command';

export type TransmettreAttestationConformitéUseCase = Message<
  'Lauréat.Achèvement.AttestationConformité.UseCase.TransmettreAttestationConformité',
  {
    identifiantProjetValue: string;
    attestationValue: {
      content: ReadableStream;
      format: string;
    };
    dateTransmissionAuCocontractantValue: string;
    preuveTransmissionAuCocontractantValue: {
      content: ReadableStream;
      format: string;
    };
    dateValue: string;
    utilisateurValue: string;
  }
>;

export const registerTransmettreAttestationConformitéUseCase = () => {
  const runner: MessageHandler<TransmettreAttestationConformitéUseCase> = async ({
    identifiantProjetValue,
    attestationValue,
    dateValue,
    preuveTransmissionAuCocontractantValue,
    dateTransmissionAuCocontractantValue,
    utilisateurValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const attestation = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentAchèvement.attestationConformitéValueType.formatter(),
      dateValue,
      attestationValue.format,
    );
    const dateTransmissionAuCocontractant = DateTime.convertirEnValueType(
      dateTransmissionAuCocontractantValue,
    );
    const preuveTransmissionAuCocontractant = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentAchèvement.attestationConformitéPreuveTransmissionValueType.formatter(),
      dateTransmissionAuCocontractantValue,
      preuveTransmissionAuCocontractantValue.format,
    );
    const date = DateTime.convertirEnValueType(dateValue);

    const utilisateur = IdentifiantUtilisateur.convertirEnValueType(utilisateurValue);

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: attestationValue.content,
        documentProjet: attestation,
      },
    });

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: preuveTransmissionAuCocontractantValue.content,
        documentProjet: preuveTransmissionAuCocontractant,
      },
    });

    await mediator.send<TransmettreAttestationConformitéCommand>({
      type: 'Lauréat.Achèvement.AttestationConformité.Command.TransmettreAttestationConformité',
      data: {
        identifiantProjet,
        attestation,
        date,
        preuveTransmissionAuCocontractant,
        dateTransmissionAuCocontractant,
        utilisateur,
      },
    });

    await mediator.send<AnnulerTâchesPlanifiéesGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.AnnulerTâchesPlanifiées',
      data: {
        identifiantProjet,
      },
    });
  };
  mediator.register(
    'Lauréat.Achèvement.AttestationConformité.UseCase.TransmettreAttestationConformité',
    runner,
  );
};
