import { Message, MessageHandler, mediator } from 'mediateur';
import { AjouterGestionnaireRéseauCommand } from './ajouterGestionnaireRéseau.command';
import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';

export type AjouterGestionnaireRéseauUseCase = Message<
  'AJOUTER_GESTIONNAIRE_RÉSEAU_USECASE',
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

export const registerAjouterGestionnaireRéseauUseCase = () => {
  const handler: MessageHandler<AjouterGestionnaireRéseauUseCase> = async ({
    aideSaisieRéférenceDossierRaccordementValue: {
      expressionReguliereValue,
      formatValue,
      légendeValue,
    },
    identifiantGestionnaireRéseauValue,
    raisonSocialeValue,
  }) => {
    const identifiantGestionnaireRéseau = IdentifiantGestionnaireRéseau.convertirEnValueType(
      identifiantGestionnaireRéseauValue,
    );

    await mediator.send<AjouterGestionnaireRéseauCommand>({
      type: 'AJOUTER_GESTIONNAIRE_RÉSEAU_COMMAND',
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

  mediator.register('AJOUTER_GESTIONNAIRE_RÉSEAU_USECASE', handler);
};
