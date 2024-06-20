import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { TypeDocumentRéponseDemandeMainlevée } from '../..';
import { ModifierRéponseSignéeMainlevéeAccordéeCommand } from './modifierRéponseSignéeMainlevée.command';

export type ModifierRéponseSignéeMainlevéeAccordéeUseCase = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.UseCase.ModifierRéponseSignéeAccord',
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

export const registerModifierRéponseSignéeMainlevéeAccordéeUseCase = () => {
  const runner: MessageHandler<ModifierRéponseSignéeMainlevéeAccordéeUseCase> = async ({
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

    await mediator.send<ModifierRéponseSignéeMainlevéeAccordéeCommand>({
      type: 'Lauréat.GarantiesFinancières.Mainlevée.Command.ModifierRéponseSignéeAccord',
      data: {
        identifiantProjet,
        modifiéeLe,
        modifiéePar,
        rejetéeLe,
        nouvelleRéponseSignée: réponseSignée,
      },
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Mainlevée.UseCase.ModifierRéponseSignéeAccord',
    runner,
  );
};
