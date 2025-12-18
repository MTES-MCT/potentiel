import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { TypeDocumentChangementReprésentantLégal, TypeReprésentantLégal } from '..';
import { DocumentProjet, IdentifiantProjet } from '../../..';
import { EnregistrerDocumentProjetCommand } from '../../../document-projet';

import { ModifierReprésentantLégalCommand } from './modifierReprésentantLégal.command';

export type ModifierReprésentantLégalUseCase = Message<
  'Lauréat.ReprésentantLégal.UseCase.ModifierReprésentantLégal',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    nomReprésentantLégalValue: string;
    typeReprésentantLégalValue: string;
    dateModificationValue: string;
    raisonValue?: string;
    pièceJustificativeValue?: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerModifierReprésentantLégalUseCase = () => {
  const runner: MessageHandler<ModifierReprésentantLégalUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    nomReprésentantLégalValue,
    typeReprésentantLégalValue,
    dateModificationValue,
    raisonValue,
    pièceJustificativeValue,
  }) => {
    const piècesJustificatives = pièceJustificativeValue
      ? DocumentProjet.convertirEnValueType(
          identifiantProjetValue,
          TypeDocumentChangementReprésentantLégal.pièceJustificative.formatter(),
          dateModificationValue,
          pièceJustificativeValue.format,
        )
      : undefined;

    if (piècesJustificatives) {
      await mediator.send<EnregistrerDocumentProjetCommand>({
        type: 'Document.Command.EnregistrerDocumentProjet',
        data: {
          content: pièceJustificativeValue!.content,
          documentProjet: piècesJustificatives,
        },
      });
    }

    await mediator.send<ModifierReprésentantLégalCommand>({
      type: 'Lauréat.ReprésentantLégal.Command.ModifierReprésentantLégal',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        nomReprésentantLégal: nomReprésentantLégalValue,
        typeReprésentantLégal: TypeReprésentantLégal.convertirEnValueType(
          typeReprésentantLégalValue,
        ),
        dateModification: DateTime.convertirEnValueType(dateModificationValue),
        raison: raisonValue,
        piècesJustificatives,
      },
    });
  };

  mediator.register('Lauréat.ReprésentantLégal.UseCase.ModifierReprésentantLégal', runner);
};
