import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '../../../../document-projet';
import { TypeReprésentantLégal } from '../..';
import * as TypeDocumentChangementReprésentantLégal from '../typeDocumentChangementReprésentantLégal.valueType';
import { IdentifiantProjet } from '../../../..';

import { DemanderChangementReprésentantLégalCommand } from './demanderChangementReprésentantLégal.command';

export type DemanderChangementReprésentantLégalUseCase = Message<
  'Lauréat.ReprésentantLégal.UseCase.DemanderChangementReprésentantLégal',
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
  }
>;

export const registerDemanderChangementReprésentantLégalUseCase = () => {
  const runner: MessageHandler<DemanderChangementReprésentantLégalUseCase> = async ({
    identifiantProjetValue,
    nomReprésentantLégalValue,
    typeReprésentantLégalValue,
    pièceJustificativeValue,
    identifiantUtilisateurValue,
    dateDemandeValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const dateDemande = DateTime.convertirEnValueType(dateDemandeValue);
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

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: pièceJustificativeValue.content,
        documentProjet: pièceJustificative,
      },
    });

    await mediator.send<DemanderChangementReprésentantLégalCommand>({
      type: 'Lauréat.ReprésentantLégal.Command.DemanderChangementReprésentantLégal',
      data: {
        identifiantProjet,
        nomReprésentantLégal: nomReprésentantLégalValue,
        typeReprésentantLégal,
        identifiantUtilisateur,
        dateDemande,
        pièceJustificative,
      },
    });
  };

  mediator.register(
    'Lauréat.ReprésentantLégal.UseCase.DemanderChangementReprésentantLégal',
    runner,
  );
};
