import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { AjouterTâchePlanifiéeCommand } from '@potentiel-domain/tache-planifiee';

import { TypeReprésentantLégal, TypeTâchePlanifiéeChangementReprésentantLégal } from '../..';
import * as TypeDocumentChangementReprésentantLégal from '../typeDocumentChangementReprésentantLégal.valueType';

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

    const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: {
        identifiantAppelOffre: identifiantProjet.appelOffre,
      },
    });

    if (Option.isNone(appelOffre)) {
      throw new Error("L'appel d'offre n'existe pas");
    }

    const période = appelOffre.periodes.find((période) => période.id === identifiantProjet.période);

    if (!période) {
      throw new Error("La période n'existe pas");
    }

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
    const {
      changement: {
        représentantLégal: { typeTâchePlanifiée },
      },
    } = période;

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

    mediator.send<AjouterTâchePlanifiéeCommand>({
      type: 'System.TâchePlanifiée.Command.AjouterTâchePlanifiée',
      data: {
        identifiantProjet,
        tâches: [
          {
            typeTâchePlanifiée:
              TypeTâchePlanifiéeChangementReprésentantLégal.convertirEnValueType(typeTâchePlanifiée)
                .type,
            àExécuterLe: dateDemande.ajouterNombreDeMois(3),
          },
        ],
      },
    });
  };

  mediator.register(
    'Lauréat.ReprésentantLégal.UseCase.DemanderChangementReprésentantLégal',
    runner,
  );
};
