import { Message, MessageHandler, mediator } from 'mediateur';

import { Email, ExpressionRegulière } from '@potentiel-domain/common';

import { IdentifiantGestionnaireRéseau } from '../index.js';

import { ModifierGestionnaireRéseauCommand } from './modifierGestionnaireRéseau.command.js';

export type ModifierGestionnaireRéseauUseCase = Message<
  'Réseau.Gestionnaire.UseCase.ModifierGestionnaireRéseau',
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

export const registerModifierGestionnaireRéseauUseCase = () => {
  const handler: MessageHandler<ModifierGestionnaireRéseauUseCase> = async ({
    identifiantGestionnaireRéseauValue,
    raisonSocialeValue,
    aideSaisieRéférenceDossierRaccordementValue: {
      expressionReguliereValue,
      formatValue,
      légendeValue,
    },
    contactEmailValue,
  }) => {
    return mediator.send<ModifierGestionnaireRéseauCommand>({
      type: 'Réseau.Gestionnaire.Command.ModifierGestionnaireRéseau',
      data: {
        identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.convertirEnValueType(
          identifiantGestionnaireRéseauValue,
        ),
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

  mediator.register('Réseau.Gestionnaire.UseCase.ModifierGestionnaireRéseau', handler);
};
