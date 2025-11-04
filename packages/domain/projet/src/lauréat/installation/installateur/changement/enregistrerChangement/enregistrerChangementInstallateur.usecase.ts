import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { IdentifiantProjet } from '../../../../..';
import { TypeDocumentInstallateur } from '../../..';

import { EnregistrerChangementInstallateurCommand } from './enregistrerChangementInstallateur.command';

export type EnregistrerChangementInstallateurUseCase = Message<
  'Lauréat.Installateur.UseCase.EnregistrerChangement',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    installateurValue: string;
    dateChangementValue: string;
    raisonValue?: string;
    pièceJustificativeValue?: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerEnregistrerChangementInstallateurUseCase = () => {
  const handler: MessageHandler<EnregistrerChangementInstallateurUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    installateurValue,
    dateChangementValue,
    pièceJustificativeValue,
    raisonValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);
    const dateChangement = DateTime.convertirEnValueType(dateChangementValue);
    const pièceJustificative =
      pièceJustificativeValue &&
      DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        TypeDocumentInstallateur.pièceJustificative.formatter(),
        dateChangement.formatter(),
        pièceJustificativeValue.format,
      );

    await mediator.send<EnregistrerChangementInstallateurCommand>({
      type: 'Lauréat.Installateur.Command.EnregistrerChangement',
      data: {
        identifiantProjet,
        identifiantUtilisateur,
        installateur: installateurValue,
        dateChangement,
        pièceJustificative,
        raison: raisonValue,
      },
    });

    if (pièceJustificative) {
      await mediator.send<EnregistrerDocumentProjetCommand>({
        type: 'Document.Command.EnregistrerDocumentProjet',
        data: {
          content: pièceJustificativeValue.content,
          documentProjet: pièceJustificative,
        },
      });
    }
  };

  mediator.register('Lauréat.Installateur.UseCase.EnregistrerChangement', handler);
};
