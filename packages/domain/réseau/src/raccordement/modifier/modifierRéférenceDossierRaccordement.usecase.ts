import { mediator, MessageHandler, Message } from 'mediateur';
import { ModifierRéférenceDossierRaccordementCommand } from './modifierRéférenceDossierRaccordement.command';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';
import { ExpressionRegulière, IdentifiantProjet } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';
import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';

export type ModifierRéférenceDossierRaccordementUseCase = Message<
  'MODIFIER_RÉFÉRENCE_DOSSIER_RACCORDEMENT_USE_CASE',
  {
    identifiantProjetValue: string;
    identifiantGestionnaireRéseauValue: string;
    référenceDossierRaccordementActuelleValue: string;
    nouvelleRéférenceDossierRaccordementValue: string;
    référenceDossierExpressionRegulièreValue: string;
    rôleValue: string;
  }
>;

export const registerModifierRéférenceDossierRaccordementUseCase = () => {
  const runner: MessageHandler<ModifierRéférenceDossierRaccordementUseCase> = async ({
    identifiantGestionnaireRéseauValue,
    identifiantProjetValue,
    nouvelleRéférenceDossierRaccordementValue,
    référenceDossierExpressionRegulièreValue,
    référenceDossierRaccordementActuelleValue,
    rôleValue,
  }) => {
    const identifiantGestionnaireRéseau = IdentifiantGestionnaireRéseau.convertirEnValueType(
      identifiantGestionnaireRéseauValue,
    );
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const nouvelleRéférenceDossierRaccordement = RéférenceDossierRaccordement.convertirEnValueType(
      nouvelleRéférenceDossierRaccordementValue,
    );
    const référenceDossierExpressionRegulière = ExpressionRegulière.convertirEnValueType(
      référenceDossierExpressionRegulièreValue,
    );
    const référenceDossierRaccordementActuelle = RéférenceDossierRaccordement.convertirEnValueType(
      référenceDossierRaccordementActuelleValue,
    );
    const rôle = Role.convertirEnValueType(rôleValue);

    // TODO: Move DCR et PTF

    await mediator.send<ModifierRéférenceDossierRaccordementCommand>({
      type: 'MODIFIER_RÉFÉRENCE_DOSSIER_RACCORDEMENT_COMMAND',
      data: {
        identifiantGestionnaireRéseau,
        identifiantProjet,
        nouvelleRéférenceDossierRaccordement,
        référenceDossierExpressionRegulière,
        référenceDossierRaccordementActuelle,
        rôle,
      },
    });
  };

  mediator.register('MODIFIER_RÉFÉRENCE_DOSSIER_RACCORDEMENT_USE_CASE', runner);
};
