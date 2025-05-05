import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { TypeDocumentProducteur } from '../..';

import { EnregistrerChangementProducteurCommand } from './enregistrerChangementProducteur.command';

export type EnregistrerChangementProducteurUseCase = Message<
  'Lauréat.Producteur.UseCase.EnregistrerChangement',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    producteurValue: string;
    dateChangementValue: string;
    raisonValue?: string;
    pièceJustificativeValue: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerEnregistrerChangementProducteurUseCase = () => {
  const runner: MessageHandler<EnregistrerChangementProducteurUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    producteurValue,
    dateChangementValue,
    pièceJustificativeValue,
    raisonValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

    const pièceJustificative = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentProducteur.pièceJustificative.formatter(),
      dateChangementValue,
      pièceJustificativeValue.format,
    );

    await mediator.send<EnregistrerChangementProducteurCommand>({
      type: 'Lauréat.Producteur.Command.EnregistrerChangement',
      data: {
        identifiantProjet,
        identifiantUtilisateur,
        producteur: producteurValue,
        dateChangement: DateTime.convertirEnValueType(dateChangementValue),
        pièceJustificative,
        raison: raisonValue,
      },
    });

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: pièceJustificativeValue.content,
        documentProjet: pièceJustificative,
      },
    });
  };
  mediator.register('Lauréat.Producteur.UseCase.EnregistrerChangement', runner);
};
