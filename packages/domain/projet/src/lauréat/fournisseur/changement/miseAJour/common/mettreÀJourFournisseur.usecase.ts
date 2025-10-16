import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { Role } from '@potentiel-domain/utilisateur';

import { IdentifiantProjet } from '../../../../..';
import { Fournisseur, TypeDocumentFournisseur } from '../../..';

import { MettreÀJourFournisseurCommand } from './mettreÀJourFournisseur.command';

export type MettreÀJourFournisseurUseCase = Message<
  'Lauréat.Fournisseur.UseCase.MettreÀJour',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    rôleUtilisateurValue: string;
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

export const registerMettreÀJourFournisseurUseCase = () => {
  const handler: MessageHandler<MettreÀJourFournisseurUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    fournisseursValue,
    dateValue,
    pièceJustificativeValue,
    évaluationCarboneSimplifiéeValue,
    raisonValue,
    rôleUtilisateurValue,
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

    await mediator.send<MettreÀJourFournisseurCommand>({
      type: 'Lauréat.Fournisseur.Command.MettreÀJour',
      data: {
        identifiantProjet,
        identifiantUtilisateur,
        date,
        pièceJustificative,
        raison: raisonValue,
        rôleUtilisateur: Role.convertirEnValueType(rôleUtilisateurValue),
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

  mediator.register('Lauréat.Fournisseur.UseCase.MettreÀJour', handler);
};
