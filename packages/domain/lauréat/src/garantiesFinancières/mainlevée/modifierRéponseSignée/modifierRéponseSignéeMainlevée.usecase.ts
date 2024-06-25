import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { TypeDocumentRéponseDemandeMainlevée } from '../..';
import { ModifierRéponseSignéeMainlevéeCommand } from './modifierRéponseSignéeMainlevée.command';

export type ModifierRéponseSignéeMainlevéeUseCase = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.UseCase.ModifierRéponseSignée',
  {
    identifiantProjetValue: string;
    modifiéeLeValue: string;
    modifiéeParValue: string;
    rejetéeLeValue?: string;
    nouvelleRéponseSignéeValue: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerModifierRéponseSignéeMainlevéeUseCase = () => {
  const runner: MessageHandler<ModifierRéponseSignéeMainlevéeUseCase> = async ({
    identifiantProjetValue,
    modifiéeLeValue,
    modifiéeParValue,
    rejetéeLeValue,
    nouvelleRéponseSignéeValue: { format, content },
  }) => {
    const isAMainlevéeRejetéeModification = rejetéeLeValue !== undefined;

    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const modifiéeLe = DateTime.convertirEnValueType(modifiéeLeValue);
    const modifiéePar = Email.convertirEnValueType(modifiéeParValue);
    const rejetéeLe = isAMainlevéeRejetéeModification
      ? DateTime.convertirEnValueType(rejetéeLeValue)
      : undefined;
    const typeDocument = isAMainlevéeRejetéeModification
      ? TypeDocumentRéponseDemandeMainlevée.courrierRéponseDemandeMainlevéeRejetéeValueType.formatter()
      : TypeDocumentRéponseDemandeMainlevée.courrierRéponseDemandeMainlevéeAccordéeValueType.formatter();

    const réponseSignée = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      typeDocument,
      modifiéeLe.formatter(),
      format,
    );

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content,
        documentProjet: réponseSignée,
      },
    });

    await mediator.send<ModifierRéponseSignéeMainlevéeCommand>({
      type: 'Lauréat.GarantiesFinancières.Mainlevée.Command.ModifierRéponseSignée',
      data: {
        identifiantProjet,
        modifiéeLe,
        modifiéePar,
        rejetéeLe,
        nouvelleRéponseSignée: réponseSignée,
      },
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.Mainlevée.UseCase.ModifierRéponseSignée', runner);
};
