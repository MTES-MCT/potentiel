import { ExpressionRegulière } from '@potentiel-domain/common';
import { Message, MessageHandler, mediator } from 'mediateur';
import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';
import { AjouterGestionnaireRéseauCommand } from './ajouterGestionnaireRéseau.command';

export type AjouterGestionnaireRéseauUseCase = Message<
  'Réseau.Gestionnaire.UseCase.AjouterGestionnaireRéseau',
  {
    identifiantGestionnaireRéseauValue: string;
    raisonSocialeValue: string;
    aideSaisieRéférenceDossierRaccordementValue: {
      formatValue: string;
      légendeValue: string;
      expressionReguliereValue: string;
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

    const expressionReguliere = !expressionReguliereValue
      ? ExpressionRegulière.accepteTout
      : ExpressionRegulière.convertirEnValueType(expressionReguliereValue);

    await mediator.send<AjouterGestionnaireRéseauCommand>({
      type: 'Réseau.Gestionnaire.Command.AjouterGestionnaireRéseau',
      data: {
        identifiantGestionnaireRéseau,
        raisonSociale: raisonSocialeValue,
        aideSaisieRéférenceDossierRaccordement: {
          expressionReguliere,
          format: formatValue,
          légende: légendeValue,
        },
        contactEmail: contactEmailValue,
      },
    });
  };

  mediator.register('Réseau.Gestionnaire.UseCase.AjouterGestionnaireRéseau', handler);
};
