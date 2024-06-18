import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { TypeDocumentRéponseDemandeMainlevée } from '../../..';
import { ModifierRéponseSignéeMainlevéeAccordéeCommand } from './modifierRéponseSignéeMainlevéeAccordée.command';

export type ModifierRéponseSignéeMainlevéeAccordéeUseCase = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.UseCase.ModifierRéponseSignéeAccord',
  {
    identifiantProjetValue: string;
    modifiéeLeValue: string;
    modifiéeParValue: string;
    nouvelleRéponseSignéeValue: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerModifierRéponseSignéeMainlevéeAccordéeUseCase = () => {
  const runner: MessageHandler<ModifierRéponseSignéeMainlevéeAccordéeUseCase> = async ({
    identifiantProjetValue,
    modifiéeLeValue,
    modifiéeParValue,
    nouvelleRéponseSignéeValue: { format, content },
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const modifiéeLe = DateTime.convertirEnValueType(modifiéeLeValue);
    const modifiéePar = Email.convertirEnValueType(modifiéeParValue);
    const réponseSignée = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentRéponseDemandeMainlevée.courrierRéponseDemandeMainlevéeAccordéeValueType.formatter(),
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

    await mediator.send<ModifierRéponseSignéeMainlevéeAccordéeCommand>({
      type: 'Lauréat.GarantiesFinancières.Mainlevée.Command.ModifierRéponseSignéeAccord',
      data: {
        identifiantProjet,
        modifiéeLe,
        modifiéePar,
        nouvelleRéponseSignée: réponseSignée,
      },
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Mainlevée.UseCase.ModifierRéponseSignéeAccord',
    runner,
  );
};
