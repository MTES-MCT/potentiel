import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, CorrigerDocumentProjetCommand } from '../../../../document-projet';
import * as TypeDocumentChangementReprésentantLégal from '../typeDocumentChangementReprésentantLégal.valueType';
import { IdentifiantProjet } from '../../../..';
import { TypeReprésentantLégal } from '../..';

import { CorrigerChangementReprésentantLégalCommand } from './corrigerChangementReprésentantLégal.command';

export type CorrigerChangementReprésentantLégalUseCase = Message<
  'Lauréat.ReprésentantLégal.UseCase.CorrigerChangementReprésentantLégal',
  {
    identifiantProjetValue: string;
    nomReprésentantLégalValue: string;
    typeReprésentantLégalValue: string;
    pièceJustificativeValue: {
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
    const pièceJustificative = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentChangementReprésentantLégal.pièceJustificative.formatter(),
      dateDemandeValue,
      pièceJustificativeValue.format,
    );

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

    await mediator.send<CorrigerDocumentProjetCommand>({
      type: 'Document.Command.CorrigerDocumentProjet',
      data: {
        content: pièceJustificativeValue.content,
        documentProjetKey: pièceJustificative.formatter(),
      },
    });
  };

  mediator.register(
    'Lauréat.ReprésentantLégal.UseCase.CorrigerChangementReprésentantLégal',
    runner,
  );
};
