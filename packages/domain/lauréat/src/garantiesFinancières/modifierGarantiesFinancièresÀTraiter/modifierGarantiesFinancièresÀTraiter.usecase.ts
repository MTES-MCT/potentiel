import { Message, MessageHandler, mediator } from 'mediateur';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { TypeDocumentGarantiesFinancières, TypeGarantiesFinancières } from '..';
import { ModifierGarantiesFinancièresÀTraiterCommand } from './modifierGarantiesFinancièresÀTraiter.command';

export type ModifierGarantiesFinancièresÀTraiterUseCase = Message<
  'MODIFIER_GARANTIES_FINANCIÈRES_À_TRAITER_USECASE',
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

export const registerModifierGarantiesFinancièresÀTraiterUseCase = () => {
  const runner: MessageHandler<ModifierGarantiesFinancièresÀTraiterUseCase> = async ({
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
      TypeDocumentGarantiesFinancières.convertirEnGarantiesFinancièresSoumisesValueType.formatter(),
      soumisLeValue,
      attestationValue.format,
    );

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'ENREGISTRER_DOCUMENT_PROJET_COMMAND',
      data: {
        content: attestationValue.content,
        documentProjet: attestation,
      },
    });

    await mediator.send<ModifierGarantiesFinancièresÀTraiterCommand>({
      type: 'MODIFIER_GARANTIES_FINANCIÈRES_À_TRAITER_COMMAND',
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
  mediator.register('MODIFIER_GARANTIES_FINANCIÈRES_À_TRAITER_USECASE', runner);
};
