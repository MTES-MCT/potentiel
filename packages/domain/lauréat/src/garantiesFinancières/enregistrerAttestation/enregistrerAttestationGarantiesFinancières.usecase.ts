import { Message, MessageHandler, mediator } from 'mediateur';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { TypeDocumentGarantiesFinancières } from '..';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { EnregistrerAttestationGarantiesFinancièresCommand } from './enregistrerAttestationGarantiesFinancières.command';

export type EnregistrerAttestationGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.EnregistrerAttestation',
  {
    identifiantProjetValue: string;
    attestationValue: {
      content: ReadableStream;
      format: string;
    };
    dateConstitutionValue: string;
    enregistréLeValue: string;
    enregistréParValue: string;
  }
>;

export const registerEnregistrerAttestationGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<EnregistrerAttestationGarantiesFinancièresUseCase> = async ({
    attestationValue,
    dateConstitutionValue,
    identifiantProjetValue,
    enregistréLeValue,
    enregistréParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateConstitution = DateTime.convertirEnValueType(dateConstitutionValue);
    const enregistréLe = DateTime.convertirEnValueType(enregistréLeValue);
    const attestation = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentGarantiesFinancières.garantiesFinancièresValidéesValueType.formatter(),
      enregistréLeValue,
      attestationValue.format,
    );
    const enregistréPar = IdentifiantUtilisateur.convertirEnValueType(enregistréParValue);

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: attestationValue.content,
        documentProjet: attestation,
      },
    });

    await mediator.send<EnregistrerAttestationGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.EnregistrerAttestation',
      data: {
        attestation,
        dateConstitution,
        identifiantProjet,
        enregistréLe,
        enregistréPar,
      },
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.UseCase.EnregistrerAttestation', runner);
};
