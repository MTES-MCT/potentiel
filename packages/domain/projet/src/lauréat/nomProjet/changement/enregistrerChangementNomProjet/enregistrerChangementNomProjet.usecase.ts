import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, IdentifiantProjet } from '../../../..';
import { TypeDocumentNomProjet } from '../../..';
import { EnregistrerDocumentProjetCommand } from '../../../../document-projet';

import { EnregistrerChangementNomProjetCommand } from './enregistrerChangementNomProjet.command';

export type EnregistrerChangementNomProjetUseCase = Message<
  'Lauréat.UseCase.EnregistrerChangementNomProjet',
  {
    identifiantProjetValue: string;
    enregistréParValue: string;
    nomProjetValue: string;
    enregistréLeValue: string;
    raisonValue: string;
    pièceJustificativeValue: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerEnregistrerChangementNomProjetUseCase = () => {
  const runner: MessageHandler<EnregistrerChangementNomProjetUseCase> = async ({
    identifiantProjetValue,
    enregistréParValue,
    nomProjetValue,
    enregistréLeValue,
    pièceJustificativeValue,
    raisonValue,
  }) => {
    const pièceJustificative = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentNomProjet.pièceJustificative.formatter(),
      enregistréLeValue,
      pièceJustificativeValue.format,
    );

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: pièceJustificativeValue!.content,
        documentProjet: pièceJustificative,
      },
    });

    await mediator.send<EnregistrerChangementNomProjetCommand>({
      type: 'Lauréat.Command.EnregistrerChangementNomProjet',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        enregistréPar: Email.convertirEnValueType(enregistréParValue),
        nomProjet: nomProjetValue,
        enregistréLe: DateTime.convertirEnValueType(enregistréLeValue),
        pièceJustificative,
        raison: raisonValue,
      },
    });
  };
  mediator.register('Lauréat.UseCase.EnregistrerChangementNomProjet', runner);
};
