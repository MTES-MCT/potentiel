import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { Localité } from '../../candidature';
import { DocumentProjet, IdentifiantProjet } from '../..';
import { TypeDocumentSiteDeProduction } from '..';
import { EnregistrerDocumentProjetCommand } from '../../document-projet';

import { ModifierSiteDeProductionCommand } from './modifierSiteDeProduction.command';

export type ModifierSiteDeProductionUseCase = Message<
  'Lauréat.UseCase.ModifierSiteDeProduction',
  {
    identifiantProjetValue: string;
    modifiéLeValue: string;
    modifiéParValue: string;
    localitéValue: Localité.RawType;
    raisonValue: string;
    pièceJustificativeValue?: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerModifierSiteDeProductionUseCase = () => {
  const handler: MessageHandler<ModifierSiteDeProductionUseCase> = async ({
    identifiantProjetValue,
    modifiéLeValue,
    modifiéParValue,
    localitéValue,
    raisonValue,
    pièceJustificativeValue,
  }) => {
    const pièceJustificative = pièceJustificativeValue
      ? DocumentProjet.convertirEnValueType(
          identifiantProjetValue,
          TypeDocumentSiteDeProduction.pièceJustificative.formatter(),
          modifiéLeValue,
          pièceJustificativeValue.format,
        )
      : undefined;

    if (pièceJustificative) {
      await mediator.send<EnregistrerDocumentProjetCommand>({
        type: 'Document.Command.EnregistrerDocumentProjet',
        data: {
          content: pièceJustificativeValue!.content,
          documentProjet: pièceJustificative,
        },
      });
    }
    await mediator.send<ModifierSiteDeProductionCommand>({
      type: 'Lauréat.Command.ModifierSiteDeProduction',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        modifiéLe: DateTime.convertirEnValueType(modifiéLeValue),
        modifiéPar: Email.convertirEnValueType(modifiéParValue),
        localité: Localité.bind(localitéValue),
        raison: raisonValue,
        pièceJustificative,
      },
    });
  };

  mediator.register('Lauréat.UseCase.ModifierSiteDeProduction', handler);
};
