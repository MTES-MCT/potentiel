import { mediator, MessageHandler, Message } from 'mediateur';
import { ModifierRéférenceDossierRaccordementCommand } from './modifierRéférenceDossierRaccordement.command';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';
import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { DossierProjet, DéplacerDocumentProjetCommand } from '@potentiel-domain/document';
import * as TypeDocumentRaccordement from '../typeDocumentRaccordement.valueType';

export type ModifierRéférenceDossierRaccordementUseCase = Message<
  'MODIFIER_RÉFÉRENCE_DOSSIER_RACCORDEMENT_USE_CASE',
  {
    identifiantProjetValue: string;
    identifiantGestionnaireRéseauValue: string;
    référenceDossierRaccordementActuelleValue: string;
    nouvelleRéférenceDossierRaccordementValue: string;
    rôleValue: string;
  }
>;

export const registerModifierRéférenceDossierRaccordementUseCase = () => {
  const runner: MessageHandler<ModifierRéférenceDossierRaccordementUseCase> = async ({
    identifiantGestionnaireRéseauValue,
    identifiantProjetValue,
    nouvelleRéférenceDossierRaccordementValue,
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
    const référenceDossierRaccordementActuelle = RéférenceDossierRaccordement.convertirEnValueType(
      référenceDossierRaccordementActuelleValue,
    );
    const rôle = Role.convertirEnValueType(rôleValue);

    const dossierAccuséRéceptionSource = DossierProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentRaccordement.convertirEnAccuséRéceptionValueType(
        référenceDossierRaccordementActuelleValue,
      ).formatter(),
    );

    const dossierAccuséRéceptionDestination = DossierProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentRaccordement.convertirEnAccuséRéceptionValueType(
        nouvelleRéférenceDossierRaccordementValue,
      ).formatter(),
    );

    const dossierPropositionTechniqueEtFinancièreSignéeSource = DossierProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentRaccordement.convertirEnPropositionTechniqueEtFinancièreValueType(
        référenceDossierRaccordementActuelleValue,
      ).formatter(),
    );

    const dossierPropositionTechniqueEtFinancièreSignéeDestination =
      DossierProjet.convertirEnValueType(
        identifiantProjetValue,
        TypeDocumentRaccordement.convertirEnPropositionTechniqueEtFinancièreValueType(
          nouvelleRéférenceDossierRaccordementValue,
        ).formatter(),
      );

    await mediator.send<DéplacerDocumentProjetCommand>({
      type: 'DÉPLACER_DOCUMENT_PROJET_COMMAND',
      data: {
        dossierProjetSource: dossierAccuséRéceptionSource,
        dossierProjetTarget: dossierAccuséRéceptionDestination,
      },
    });

    await mediator.send<DéplacerDocumentProjetCommand>({
      type: 'DÉPLACER_DOCUMENT_PROJET_COMMAND',
      data: {
        dossierProjetSource: dossierPropositionTechniqueEtFinancièreSignéeSource,
        dossierProjetTarget: dossierPropositionTechniqueEtFinancièreSignéeDestination,
      },
    });

    await mediator.send<ModifierRéférenceDossierRaccordementCommand>({
      type: 'MODIFIER_RÉFÉRENCE_DOSSIER_RACCORDEMENT_COMMAND',
      data: {
        identifiantGestionnaireRéseau,
        identifiantProjet,
        nouvelleRéférenceDossierRaccordement,
        référenceDossierRaccordementActuelle,
        rôle,
      },
    });
  };

  mediator.register('MODIFIER_RÉFÉRENCE_DOSSIER_RACCORDEMENT_USE_CASE', runner);
};
