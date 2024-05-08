import { ExpressionRegulière } from '@potentiel-domain/common';
import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantGestionnaireRéseau } from '..';
import { ModifierGestionnaireRéseauCommand } from './modifierGestionnaireRéseau.command';

export type ModifierGestionnaireRéseauUseCase = Message<
  'Réseau.Gestionnaire.UseCase.ModifierGestionnaireRéseau',
  {
    identifiantGestionnaireRéseauValue: string;
    raisonSocialeValue: string;
    aideSaisieRéférenceDossierRaccordementValue: {
      formatValue: string;
      légendeValue: string;
      expressionReguliereValue: string;
    };
    // contactInformationsValue?: {
    //   emailValue?: string;
    //   phoneValue?: string;
    // };
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
    // contactInformationsValue: { emailValue, phoneValue },
  }) => {
    const identifiantGestionnaireRéseau = IdentifiantGestionnaireRéseau.convertirEnValueType(
      identifiantGestionnaireRéseauValue,
    );

    const expressionReguliere = !expressionReguliereValue
      ? ExpressionRegulière.accepteTout
      : ExpressionRegulière.convertirEnValueType(expressionReguliereValue);

    return mediator.send<ModifierGestionnaireRéseauCommand>({
      type: 'Réseau.Gestionnaire.Command.ModifierGestionnaireRéseau',
      data: {
        identifiantGestionnaireRéseau,
        raisonSociale: raisonSocialeValue,
        aideSaisieRéférenceDossierRaccordement: {
          expressionReguliere,
          format: formatValue,
          légende: légendeValue,
        },
        // contactInformations: contactInformationsValue
      },
    });
  };

  mediator.register('Réseau.Gestionnaire.UseCase.ModifierGestionnaireRéseau', handler);
};
