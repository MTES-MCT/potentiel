import { Message, MessageHandler, mediator } from 'mediateur';

import { Email, ExpressionRegulière } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

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
    const format = Option.map(formatValue);
    const légende = Option.map(légendeValue);
    const expressionReguliere = Option.map(expressionReguliereValue);
    const contactEmail = Option.map(contactEmailValue);

    return mediator.send<ModifierGestionnaireRéseauCommand>({
      type: 'Réseau.Gestionnaire.Command.ModifierGestionnaireRéseau',
      data: {
        identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.convertirEnValueType(
          identifiantGestionnaireRéseauValue,
        ),
        raisonSociale: raisonSocialeValue,
        aideSaisieRéférenceDossierRaccordement: {
          expressionReguliere: Option.match(expressionReguliere)
            .some(ExpressionRegulière.convertirEnValueType)
            .none(),
          format,
          légende,
        },
        contactEmail: Option.match(contactEmail).some(Email.convertirEnValueType).none(),
      },
    });
  };

  mediator.register('Réseau.Gestionnaire.UseCase.ModifierGestionnaireRéseau', handler);
};
