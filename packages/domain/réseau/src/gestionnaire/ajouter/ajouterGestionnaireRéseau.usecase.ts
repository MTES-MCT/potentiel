import { Message, MessageHandler, mediator } from 'mediateur';

import { Email, ExpressionRegulière } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

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

    const format = Option.map(formatValue);
    const légende = Option.map(légendeValue);
    const expressionReguliere = Option.map(expressionReguliereValue);
    const contactEmail = Option.map(contactEmailValue);

    await mediator.send<AjouterGestionnaireRéseauCommand>({
      type: 'Réseau.Gestionnaire.Command.AjouterGestionnaireRéseau',
      data: {
        identifiantGestionnaireRéseau,
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

  mediator.register('Réseau.Gestionnaire.UseCase.AjouterGestionnaireRéseau', handler);
};
