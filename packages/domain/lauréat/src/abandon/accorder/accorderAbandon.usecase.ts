// Third party
import { Message, MessageHandler, mediator } from 'mediateur';

// Workspaces
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
// eslint-disable-next-line import/order
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

// Package
import { AnnulerTâchePlanifiéeCommand } from '@potentiel-domain/tache-planifiee';

import * as TypeDocumentAbandon from '../typeDocumentAbandon.valueType';
import { TypeTâchePlanifiéeGarantiesFinancières } from '../../garantiesFinancières';
import { TypeTâchePlanifiéeChangementReprésentantLégal } from '../../représentantLégal';

import { AccorderAbandonCommand } from './accorderAbandon.command';

export type AccorderAbandonUseCase = Message<
  'Lauréat.Abandon.UseCase.AccorderAbandon',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    dateAccordValue: string;
    réponseSignéeValue: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerAccorderAbandonUseCase = () => {
  const runner: MessageHandler<AccorderAbandonUseCase> = async ({
    identifiantUtilisateurValue,
    dateAccordValue,
    réponseSignéeValue: { content, format },
    identifiantProjetValue,
  }) => {
    const réponseSignée = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentAbandon.abandonAccordé.formatter(),
      dateAccordValue,
      format,
    );

    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateAccord = DateTime.convertirEnValueType(dateAccordValue);
    const identifiantUtilisateur = IdentifiantUtilisateur.convertirEnValueType(
      identifiantUtilisateurValue,
    );

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content,
        documentProjet: réponseSignée,
      },
    });

    await mediator.send<AccorderAbandonCommand>({
      type: 'Lauréat.Abandon.Command.AccorderAbandon',
      data: {
        dateAccord,
        identifiantUtilisateur,
        identifiantProjet,
        réponseSignée,
      },
    });

    await mediator.send<AnnulerTâchePlanifiéeCommand>({
      type: 'System.TâchePlanifiée.Command.AnnulerTâchePlanifiée',
      data: {
        identifiantProjet,
        typeTâchePlanifiée: TypeTâchePlanifiéeGarantiesFinancières.échoir.type,
      },
    });

    await mediator.send<AnnulerTâchePlanifiéeCommand>({
      type: 'System.TâchePlanifiée.Command.AnnulerTâchePlanifiée',
      data: {
        identifiantProjet,
        typeTâchePlanifiée: TypeTâchePlanifiéeGarantiesFinancières.rappelÉchéanceUnMois.type,
      },
    });

    await mediator.send<AnnulerTâchePlanifiéeCommand>({
      type: 'System.TâchePlanifiée.Command.AnnulerTâchePlanifiée',
      data: {
        identifiantProjet,
        typeTâchePlanifiée: TypeTâchePlanifiéeGarantiesFinancières.rappelÉchéanceDeuxMois.type,
      },
    });

    await mediator.send<AnnulerTâchePlanifiéeCommand>({
      type: 'System.TâchePlanifiée.Command.AnnulerTâchePlanifiée',
      data: {
        identifiantProjet,
        typeTâchePlanifiée:
          TypeTâchePlanifiéeChangementReprésentantLégal.gestionAutomatiqueDemandeChangement.type,
      },
    });
  };
  mediator.register('Lauréat.Abandon.UseCase.AccorderAbandon', runner);
};
