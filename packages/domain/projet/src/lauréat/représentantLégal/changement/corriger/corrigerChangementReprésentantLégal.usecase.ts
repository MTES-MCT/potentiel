import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import {
  DocumentProjet,
  CorrigerDocumentProjetCommand,
} from '../../../../document-projet/index.js';
import * as TypeDocumentChangementReprésentantLégal from '../typeDocumentChangementReprésentantLégal.valueType.js';
import { IdentifiantProjet } from '../../../../index.js';
import { TypeReprésentantLégal } from '../../index.js';

import { CorrigerChangementReprésentantLégalCommand } from './corrigerChangementReprésentantLégal.command.js';

export type CorrigerChangementReprésentantLégalUseCase = Message<
  'Lauréat.ReprésentantLégal.UseCase.CorrigerChangementReprésentantLégal',
  {
    identifiantProjetValue: string;
    nomReprésentantLégalValue: string;
    typeReprésentantLégalValue: string;
    pièceJustificativeValue?: {
      content: ReadableStream;
      format: string;
    };
    identifiantUtilisateurValue: string;
    dateDemandeValue: string;
    dateCorrectionValue: string;
  }
>;

export const registerCorrigerChangementReprésentantLégalUseCase = () => {
  const runner: MessageHandler<CorrigerChangementReprésentantLégalUseCase> = async ({
    identifiantProjetValue,
    nomReprésentantLégalValue,
    typeReprésentantLégalValue,
    pièceJustificativeValue,
    identifiantUtilisateurValue,
    dateDemandeValue,
    dateCorrectionValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const dateCorrection = DateTime.convertirEnValueType(dateCorrectionValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);
    const typeReprésentantLégal = TypeReprésentantLégal.convertirEnValueType(
      typeReprésentantLégalValue,
    );
    const pièceJustificative = pièceJustificativeValue
      ? DocumentProjet.convertirEnValueType(
          identifiantProjetValue,
          TypeDocumentChangementReprésentantLégal.pièceJustificative.formatter(),
          dateDemandeValue,
          pièceJustificativeValue.format,
        )
      : undefined;

    await mediator.send<CorrigerChangementReprésentantLégalCommand>({
      type: 'Lauréat.ReprésentantLégal.Command.CorrigerChangementReprésentantLégal',
      data: {
        identifiantProjet,
        nomReprésentantLégal: nomReprésentantLégalValue,
        typeReprésentantLégal,
        identifiantUtilisateur,
        dateCorrection,
        pièceJustificative,
      },
    });

    if (pièceJustificativeValue) {
      await mediator.send<CorrigerDocumentProjetCommand>({
        type: 'Document.Command.CorrigerDocumentProjet',
        data: {
          content: pièceJustificativeValue.content,
          documentProjetKey: pièceJustificative!.formatter(),
        },
      });
    }
  };

  mediator.register(
    'Lauréat.ReprésentantLégal.UseCase.CorrigerChangementReprésentantLégal',
    runner,
  );
};
