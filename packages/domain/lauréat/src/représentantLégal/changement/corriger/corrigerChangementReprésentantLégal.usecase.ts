import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { TypeReprésentantLégal } from '../..';
import * as TypeDocumentChangementReprésentantLégal from '../typeDocumentChangementReprésentantLégal.valueType';

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
      dateCorrectionValue,
      pièceJustificativeValue.format,
    );

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: pièceJustificativeValue.content,
        documentProjet: pièceJustificative,
      },
    });

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

    // await mediator.send<AjouterTâchePlanifiéeCommand>({
    //   type: 'System.TâchePlanifiée.Command.AjouterTâchePlanifiée',
    //   data: {
    //     identifiantProjet,
    //     tâches: [
    //       {
    //         typeTâchePlanifiée:
    //           TypeTâchePlanifiéeChangementReprésentantLégal.gestionAutomatiqueDemandeChangement
    //             .type,
    //         àExécuterLe: dateCorrection.ajouterNombreDeMois(3),
    //       },
    //     ],
    //   },
    // });

    // await mediator.send<AjouterTâchePlanifiéeCommand>({
    //   type: 'System.TâchePlanifiée.Command.AjouterTâchePlanifiée',
    //   data: {
    //     identifiantProjet,
    //     tâches: [
    //       {
    //         typeTâchePlanifiée:
    //           TypeTâchePlanifiéeChangementReprésentantLégal.rappelInstructionÀDeuxMois.type,
    //         àExécuterLe: dateDemande.ajouterNombreDeMois(2),
    //       },
    //     ],
    //   },
    // });
  };

  mediator.register(
    'Lauréat.ReprésentantLégal.UseCase.CorrigerChangementReprésentantLégal',
    runner,
  );
};
