import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { IdentifiantProjet } from '../../../..';
import { TypeDocumentFournisseur, TypeFournisseur } from '../..';

import { EnregistrerChangementFournisseurCommand } from './enregistrerChangement.command';

export type EnregistrerChangementFournisseurUseCase = Message<
  'Lauréat.Fournisseur.UseCase.EnregistrerChangement',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    dateChangementValue: string;
    raisonValue: string;
    pièceJustificativeValue: {
      content: ReadableStream;
      format: string;
    };
  } & (
    | {
        fournisseursValue: Array<{
          typeFournisseur: TypeFournisseur.RawType;
          nomDuFabricant: string;
        }>;
        évaluationCarboneSimplifiéeValue: number;
      }
    | {
        fournisseursValue: Array<{
          typeFournisseur: TypeFournisseur.RawType;
          nomDuFabricant: string;
        }>;
        évaluationCarboneSimplifiéeValue?: undefined;
      }
    | {
        fournisseursValue?: undefined;
        évaluationCarboneSimplifiéeValue: number;
      }
  )
>;

export const registerEnregistrerChangementFournisseurUseCase = () => {
  const handler: MessageHandler<EnregistrerChangementFournisseurUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    fournisseursValue,
    dateChangementValue,
    pièceJustificativeValue,
    évaluationCarboneSimplifiéeValue,
    raisonValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);
    const dateChangement = DateTime.convertirEnValueType(dateChangementValue);

    const pièceJustificative = DocumentProjet.convertirEnValueType(
      identifiantProjet.formatter(),
      TypeDocumentFournisseur.pièceJustificative.formatter(),
      dateChangement.formatter(),
      pièceJustificativeValue.format,
    );

    await mediator.send<EnregistrerChangementFournisseurCommand>({
      type: 'Lauréat.Fournisseur.Command.EnregistrerChangement',
      data: {
        identifiantProjet,
        identifiantUtilisateur,
        dateChangement,
        pièceJustificative,
        raison: raisonValue,
        ...(fournisseursValue
          ? {
              fournisseurs: fournisseursValue?.map((fournisseur) => ({
                typeFournisseur: TypeFournisseur.convertirEnValueType(
                  fournisseur.typeFournisseur,
                ).formatter(),
                nomDuFabricant: fournisseur.nomDuFabricant,
              })),
              évaluationCarboneSimplifiée: évaluationCarboneSimplifiéeValue,
            }
          : {
              évaluationCarboneSimplifiée: évaluationCarboneSimplifiéeValue,
            }),
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

  mediator.register('Lauréat.Fournisseur.UseCase.EnregistrerChangement', handler);
};
