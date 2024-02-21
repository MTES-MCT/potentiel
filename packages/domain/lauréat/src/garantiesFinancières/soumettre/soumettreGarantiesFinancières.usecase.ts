import { Message, MessageHandler, mediator } from 'mediateur';
import { DocumentProjet } from '@potentiel-domain/document';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { TypeDocumentGarantiesFinancières, TypeGarantiesFinancières } from '..';
import { SoumettreGarantiesFinancièresCommand } from './soumettreGarantiesFinancières.command';

export type SoumettreGarantiesFinancièresUseCase = Message<
  'SOUMETTRE_GARANTIES_FINANCIÈRES_USECASE',
  {
    identifiantProjetValue: string;
    typeValue: string;
    dateÉchéanceValue?: string;
    attestationValue: {
      content: ReadableStream;
      format: string;
    };
    dateConstitutionValue: string;
    soumisLeValue: string;
    soumisParValue: string;
  }
>;

export const registerSoumettreGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<SoumettreGarantiesFinancièresUseCase> = async ({
    attestationValue,
    dateConstitutionValue,
    identifiantProjetValue,
    soumisLeValue,
    typeValue,
    dateÉchéanceValue,
    soumisParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const type = TypeGarantiesFinancières.convertirEnValueType(typeValue);
    const dateÉchéance = dateÉchéanceValue
      ? DateTime.convertirEnValueType(dateÉchéanceValue)
      : undefined;
    const soumisLe = DateTime.convertirEnValueType(soumisLeValue);
    const dateConstitution = DateTime.convertirEnValueType(dateConstitutionValue);
    const soumisPar = IdentifiantUtilisateur.convertirEnValueType(soumisParValue);

    const attestation = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentGarantiesFinancières.garantiesFinancièresÀTraiter.formatter(),
      soumisLeValue,
      attestationValue.format,
    );

    // await mediator.send<EnregistrerDocumentProjetCommand>({
    //   type: 'ENREGISTRER_DOCUMENT_PROJET_COMMAND',
    //   data: {
    //     content: attestationValue!.content,
    //     documentProjet: attestation,
    //   },
    // });

    await mediator.send<SoumettreGarantiesFinancièresCommand>({
      type: 'SOUMETTRE_GARANTIES_FINANCIÈRES_COMMAND',
      data: {
        attestation,
        dateConstitution,
        identifiantProjet,
        soumisLe,
        soumisPar,
        type,
        dateÉchéance,
      },
    });
  };
  mediator.register('SOUMETTRE_GARANTIES_FINANCIÈRES_USECASE', runner);
};
