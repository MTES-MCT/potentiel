import { Message, MessageHandler, mediator } from 'mediateur';
import { ModifierGestionnaireRéseauCommand } from './modifierGestionnaireRéseau.command';
import { IdentifiantGestionnaireRéseau } from '..';

export type ModifierGestionnaireRéseauUseCase = Message<
  'MODIFIER_GESTIONNAIRE_RÉSEAU_USECASE',
  {
    identifiantGestionnaireRéseauValue: string;
    raisonSocialeValue: string;
    aideSaisieRéférenceDossierRaccordementValue: {
      formatValue: string;
      légendeValue: string;
      expressionReguliereValue: string;
    };
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
  }) => {
    const identifiantGestionnaireRéseau = IdentifiantGestionnaireRéseau.convertirEnValueType(
      identifiantGestionnaireRéseauValue,
    );
    return mediator.send<ModifierGestionnaireRéseauCommand>({
      type: 'MODIFIER_GESTIONNAIRE_RÉSEAU',
      data: {
        identifiantGestionnaireRéseau,
        raisonSociale: raisonSocialeValue,
        aideSaisieRéférenceDossierRaccordement: {
          expressionReguliere: expressionReguliereValue,
          format: formatValue,
          légende: légendeValue,
        },
      },
    });
  };

  mediator.register('MODIFIER_GESTIONNAIRE_RÉSEAU_USECASE', handler);
};
