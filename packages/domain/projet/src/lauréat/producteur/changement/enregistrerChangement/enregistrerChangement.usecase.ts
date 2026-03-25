import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { EnregistrerDocumentProjetCommand } from '../../../../document-projet/index.js';
import { IdentifiantProjet } from '../../../../index.js';
import { DocumentProducteur } from '../../index.js';

import { EnregistrerChangementProducteurCommand } from './enregistrerChangement.command.js';

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
  const handler: MessageHandler<EnregistrerChangementProducteurUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    producteurValue,
    dateChangementValue,
    pièceJustificativeValue,
    raisonValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);
    const dateChangement = DateTime.convertirEnValueType(dateChangementValue);

    const pièceJustificative = DocumentProducteur.pièceJustificative({
      identifiantProjet: identifiantProjet.formatter(),
      enregistréLe: dateChangement.formatter(),
      pièceJustificative: pièceJustificativeValue,
    });

    await mediator.send<EnregistrerChangementProducteurCommand>({
      type: 'Lauréat.Producteur.Command.EnregistrerChangement',
      data: {
        identifiantProjet,
        identifiantUtilisateur,
        producteur: producteurValue,
        dateChangement,
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

  mediator.register('Lauréat.Producteur.UseCase.EnregistrerChangement', handler);
};
