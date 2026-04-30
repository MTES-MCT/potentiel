import { Message, MessageHandler, mediator } from 'mediateur';

import { Email, ExpressionRegulière } from '@potentiel-domain/common';

import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType.js';

import { AjouterGestionnaireRéseauCommand } from './ajouterGestionnaireRéseau.command.js';

export type AjouterGestionnaireRéseauUseCase = Message<
  'Réseau.Gestionnaire.UseCase.AjouterGestionnaireRéseau',
  {
    identifiantGestionnaireRéseauValue: string;
    raisonSocialeValue: string;
    aideSaisieRéférenceDossierRaccordementValue: {
      formatValue?: string;
      légendeValue?: string;
      expressionReguliereValue?: string;
    };
    contactEmailValue?: string;
  }
>;

export const registerAjouterGestionnaireRéseauUseCase = () => {
  const handler: MessageHandler<AjouterGestionnaireRéseauUseCase> = async ({
    aideSaisieRéférenceDossierRaccordementValue: {
      expressionReguliereValue,
      formatValue,
      légendeValue,
    },
    identifiantGestionnaireRéseauValue,
    raisonSocialeValue,
    contactEmailValue,
  }) => {
    const identifiantGestionnaireRéseau = IdentifiantGestionnaireRéseau.convertirEnValueType(
      identifiantGestionnaireRéseauValue,
    );

    await mediator.send<AjouterGestionnaireRéseauCommand>({
      type: 'Réseau.Gestionnaire.Command.AjouterGestionnaireRéseau',
      data: {
        identifiantGestionnaireRéseau,
        raisonSociale: raisonSocialeValue,
        aideSaisieRéférenceDossierRaccordement: {
          expressionReguliere: expressionReguliereValue
            ? ExpressionRegulière.convertirEnValueType(expressionReguliereValue)
            : undefined,
          format: formatValue,
          légende: légendeValue,
        },
        contactEmail: contactEmailValue ? Email.convertirEnValueType(contactEmailValue) : undefined,
      },
    });
  };

  mediator.register('Réseau.Gestionnaire.UseCase.AjouterGestionnaireRéseau', handler);
};
