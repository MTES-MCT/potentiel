import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { Coordonnées, Localité } from '../../candidature/index.js';
import { IdentifiantProjet } from '../../index.js';
import { DocumentSiteDeProduction } from '../index.js';
import { EnregistrerDocumentProjetCommand } from '../../document-projet/index.js';

import { ModifierSiteDeProductionCommand } from './modifierSiteDeProduction.command.js';

export type ModifierSiteDeProductionUseCase = Message<
  'Lauréat.UseCase.ModifierSiteDeProduction',
  {
    identifiantProjetValue: string;
    modifiéLeValue: string;
    modifiéParValue: string;
    localitéValue: Localité.RawType;
    coordonnéesValue?: {
      latitude: number;
      longitude: number;
    };
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
    coordonnéesValue,
    raisonValue,
    pièceJustificativeValue,
  }) => {
    const pièceJustificative = pièceJustificativeValue
      ? DocumentSiteDeProduction.pièceJustificative({
          identifiantProjet: identifiantProjetValue,
          modifiéLe: modifiéLeValue,
          pièceJustificative: pièceJustificativeValue,
        })
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
        coordonnées: coordonnéesValue ? Coordonnées.bind(coordonnéesValue) : undefined,
        raison: raisonValue,
        pièceJustificative,
      },
    });
  };

  mediator.register('Lauréat.UseCase.ModifierSiteDeProduction', handler);
};
