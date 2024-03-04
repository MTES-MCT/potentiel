import { Message, MessageHandler, mediator } from 'mediateur';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { TypeDocumentGarantiesFinancières, TypeGarantiesFinancières } from '..';
import { CompléterGarantiesFinancièresCommand } from './compléterGarantiesFinancières.command';
import { IdentifiantUtilisateur, Role } from '@potentiel-domain/utilisateur';

export type CompléterGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.CompléterGarantiesFinancières',
  {
    identifiantProjetValue: string;
    typeValue: string;
    dateÉchéanceValue?: string;
    attestationValue: {
      content: ReadableStream;
      format: string;
    };
    dateConstitutionValue: string;
    complétéLeValue: string;
    identifiantUtilisateurValue: string;
    rôleUtilisateurValue: string;
  }
>;

export const registerCompléterGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<CompléterGarantiesFinancièresUseCase> = async ({
    attestationValue,
    dateConstitutionValue,
    identifiantProjetValue,
    complétéLeValue,
    typeValue,
    dateÉchéanceValue,
    identifiantUtilisateurValue,
    rôleUtilisateurValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const type = TypeGarantiesFinancières.convertirEnValueType(typeValue);
    const dateÉchéance = dateÉchéanceValue
      ? DateTime.convertirEnValueType(dateÉchéanceValue)
      : undefined;
    const dateConstitution = DateTime.convertirEnValueType(dateConstitutionValue);
    const complétéLe = DateTime.convertirEnValueType(complétéLeValue);
    const attestation = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentGarantiesFinancières.garantiesFinancièresValidéesValueType.formatter(),
      complétéLeValue,
      attestationValue.format,
    );
    const identifiantUtilisateur = IdentifiantUtilisateur.convertirEnValueType(
      identifiantUtilisateurValue,
    );
    const rôleUtilisateur = Role.convertirEnValueType(rôleUtilisateurValue);

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: attestationValue.content,
        documentProjet: attestation,
      },
    });

    await mediator.send<CompléterGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.CompléterGarantiesFinancières',
      data: {
        attestation,
        dateConstitution,
        identifiantProjet,
        type,
        dateÉchéance,
        complétéLe,
        identifiantUtilisateur,
        rôleUtilisateur,
      },
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.UseCase.CompléterGarantiesFinancières', runner);
};
