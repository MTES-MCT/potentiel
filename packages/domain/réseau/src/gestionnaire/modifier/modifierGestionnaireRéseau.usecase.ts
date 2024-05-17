import { ExpressionRegulière } from '@potentiel-domain/common';
import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantGestionnaireRéseau } from '..';
import { ModifierGestionnaireRéseauCommand } from './modifierGestionnaireRéseau.command';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

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
    contactEmailValue: string;
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
    const identifiantGestionnaireRéseau = IdentifiantGestionnaireRéseau.convertirEnValueType(
      identifiantGestionnaireRéseauValue,
    );

    const expressionReguliere = !expressionReguliereValue
      ? ExpressionRegulière.accepteTout
      : ExpressionRegulière.convertirEnValueType(expressionReguliereValue);

    const contactEmail = !contactEmailValue
      ? Option.none
      : IdentifiantUtilisateur.convertirEnValueType(contactEmailValue);

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
        contactEmail,
      },
    });
  };

  mediator.register('Réseau.Gestionnaire.UseCase.ModifierGestionnaireRéseau', handler);
};
