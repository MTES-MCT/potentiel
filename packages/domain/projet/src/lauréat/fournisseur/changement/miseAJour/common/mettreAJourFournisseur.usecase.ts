import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { IdentifiantProjet } from '../../../../..';
import { Fournisseur, TypeDocumentFournisseur } from '../../..';

import { MettreAJourFournisseurCommand } from './mettreAJourFournisseur.command';

export type MettreAJourFournisseurUseCase = Message<
  'Lauréat.Fournisseur.UseCase.MettreAJour',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    typeDeChangementValue: 'modification-admin' | 'information-enregistrée';
    dateValue: string;
    raisonValue?: string;
    pièceJustificativeValue?: {
      content: ReadableStream;
      format: string;
    };
  } & (
    | {
        fournisseursValue: Array<Fournisseur.RawType>;
        évaluationCarboneSimplifiéeValue: number;
      }
    | {
        fournisseursValue: Array<Fournisseur.RawType>;
        évaluationCarboneSimplifiéeValue?: undefined;
      }
    | {
        fournisseursValue?: undefined;
        évaluationCarboneSimplifiéeValue: number;
      }
  )
>;

export const registerMettreAJourFournisseurUseCase = () => {
  const handler: MessageHandler<MettreAJourFournisseurUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    fournisseursValue,
    dateValue,
    pièceJustificativeValue,
    évaluationCarboneSimplifiéeValue,
    raisonValue,
    typeDeChangementValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);
    const date = DateTime.convertirEnValueType(dateValue);

    const pièceJustificative = pièceJustificativeValue
      ? DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          TypeDocumentFournisseur.pièceJustificative.formatter(),
          date.formatter(),
          pièceJustificativeValue.format,
        )
      : undefined;

    await mediator.send<MettreAJourFournisseurCommand>({
      type: 'Lauréat.Fournisseur.Command.MettreAJour',
      data: {
        identifiantProjet,
        identifiantUtilisateur,
        date,
        pièceJustificative,
        raison: raisonValue,
        typeDeChangement: typeDeChangementValue,
        ...(fournisseursValue
          ? {
              fournisseurs: fournisseursValue?.map(Fournisseur.convertirEnValueType),
              évaluationCarboneSimplifiée: évaluationCarboneSimplifiéeValue,
            }
          : {
              évaluationCarboneSimplifiée: évaluationCarboneSimplifiéeValue,
            }),
      },
    });

    if (pièceJustificativeValue && pièceJustificative) {
      await mediator.send<EnregistrerDocumentProjetCommand>({
        type: 'Document.Command.EnregistrerDocumentProjet',
        data: {
          content: pièceJustificativeValue.content,
          documentProjet: pièceJustificative,
        },
      });
    }
  };

  mediator.register('Lauréat.Fournisseur.UseCase.MettreAJour', handler);
};
