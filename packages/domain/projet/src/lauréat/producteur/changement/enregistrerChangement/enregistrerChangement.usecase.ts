import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { IdentifiantProjet } from '../../../..';
import { TypeDocumentProducteur } from '../..';
import { RenouvelerGarantiesFinancièresUseCase } from '../../../garanties-financières/renouveler/renouvelerGarantiesFinancières.usecase';

import { EnregistrerChangementProducteurCommand } from './enregistrerChangement.command';

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

    const pièceJustificative = DocumentProjet.convertirEnValueType(
      identifiantProjet.formatter(),
      TypeDocumentProducteur.pièceJustificative.formatter(),
      dateChangement.formatter(),
      pièceJustificativeValue.format,
    );

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

    // Use case appelé provisoirement le temps de déplacer toutes la logique métier GF depuis la package lauréat
    await mediator.send<RenouvelerGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.RenouvelerGarantiesFinancières',
      data: {
        identifiantProjetValue,
        identifiantUtilisateurValue,
      },
    });
  };

  mediator.register('Lauréat.Producteur.UseCase.EnregistrerChangement', handler);
};
