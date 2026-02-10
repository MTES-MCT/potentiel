import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import {
  DocumentProjet,
  EnregistrerDocumentProjetCommand,
} from '../../../../document-projet/index.js';
import { TypeReprésentantLégal } from '../../index.js';
import * as TypeDocumentChangementReprésentantLégal from '../typeDocumentChangementReprésentantLégal.valueType.js';
import { IdentifiantProjet } from '../../../../index.js';
import { SupprimerDocumentProjetSensibleCommand } from '../supprimerDocumentSensible/supprimerDocumentProjetSensible.command.js';

import { EnregistrerChangementReprésentantLégalCommand } from './enregistrerChangementReprésentantLégal.command.js';

export type EnregistrerChangementReprésentantLégalUseCase = Message<
  'Lauréat.ReprésentantLégal.UseCase.EnregistrerChangementReprésentantLégal',
  {
    identifiantProjetValue: string;
    nomReprésentantLégalValue: string;
    typeReprésentantLégalValue: string;
    pièceJustificativeValue: {
      content: ReadableStream;
      format: string;
    };
    identifiantUtilisateurValue: string;
    dateChangementValue: string;
  }
>;

export const registerEnregistrerChangementReprésentantLégalUseCase = () => {
  const runner: MessageHandler<EnregistrerChangementReprésentantLégalUseCase> = async ({
    identifiantProjetValue,
    nomReprésentantLégalValue,
    typeReprésentantLégalValue,
    pièceJustificativeValue,
    identifiantUtilisateurValue,
    dateChangementValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const dateChangement = DateTime.convertirEnValueType(dateChangementValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);
    const typeReprésentantLégal = TypeReprésentantLégal.convertirEnValueType(
      typeReprésentantLégalValue,
    );
    const pièceJustificative = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentChangementReprésentantLégal.pièceJustificative.formatter(),
      dateChangementValue,
      pièceJustificativeValue.format,
    );

    await mediator.send<SupprimerDocumentProjetSensibleCommand>({
      type: 'Lauréat.ReprésentantLégal.Command.SupprimerDocumentProjetSensible',
      data: {
        identifiantProjet,
        raison:
          'Pièce justificative supprimée automatiquement car un nouveau changement a été déclaré',
      },
    });

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: pièceJustificativeValue.content,
        documentProjet: pièceJustificative,
      },
    });

    await mediator.send<EnregistrerChangementReprésentantLégalCommand>({
      type: 'Lauréat.ReprésentantLégal.Command.EnregistrerChangementReprésentantLégal',
      data: {
        identifiantProjet,
        nomReprésentantLégal: nomReprésentantLégalValue,
        typeReprésentantLégal,
        identifiantUtilisateur,
        dateChangement,
        pièceJustificative,
      },
    });
  };

  mediator.register(
    'Lauréat.ReprésentantLégal.UseCase.EnregistrerChangementReprésentantLégal',
    runner,
  );
};
