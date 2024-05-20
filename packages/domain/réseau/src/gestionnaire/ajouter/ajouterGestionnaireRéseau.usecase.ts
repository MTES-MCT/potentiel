import { ExpressionRegulière } from '@potentiel-domain/common';
import { Message, MessageHandler, mediator } from 'mediateur';
import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';
import { Option } from '@potentiel-libraries/monads';
import { AjouterGestionnaireRéseauCommand } from './ajouterGestionnaireRéseau.command';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { match } from 'ts-pattern';

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

    await mediator.send<AjouterGestionnaireRéseauCommand>({
      type: 'Réseau.Gestionnaire.Command.AjouterGestionnaireRéseau',
      data: {
        identifiantGestionnaireRéseau,
        raisonSociale: raisonSocialeValue,
        aideSaisieRéférenceDossierRaccordement: {
          expressionReguliere: match(expressionReguliereValue)
            .with('', () => ExpressionRegulière.accepteTout)
            .otherwise((value) => ExpressionRegulière.convertirEnValueType(value)),
          format: formatValue,
          légende: légendeValue,
        },
        contactEmail: Option.match(Option.map(contactEmailValue))
          .some(IdentifiantUtilisateur.convertirEnValueType)
          .none(),
      },
    });
  };

  mediator.register('Réseau.Gestionnaire.UseCase.AjouterGestionnaireRéseau', handler);
};
