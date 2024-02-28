import { mediator, MessageHandler, Message } from 'mediateur';
import { ModifierRéférenceDossierRaccordementCommand } from './modifierRéférenceDossierRaccordement.command';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';
import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { DossierProjet, DéplacerDocumentProjetCommand } from '@potentiel-domain/document';
import * as TypeDocumentRaccordement from '../typeDocumentRaccordement.valueType';
import { AcheverTâcheCommand, TypeTâche } from '@potentiel-domain/tache';

export type ModifierRéférenceDossierRaccordementUseCase = Message<
  'Réseau.Raccordement.UseCase.ModifierRéférenceDossierRaccordement',
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
      type: 'Document.Command.DéplacerDocumentProjet',
      data: {
        dossierProjetSource: dossierAccuséRéceptionSource,
        dossierProjetTarget: dossierAccuséRéceptionDestination,
      },
    });

    await mediator.send<DéplacerDocumentProjetCommand>({
      type: 'Document.Command.DéplacerDocumentProjet',
      data: {
        dossierProjetSource: dossierPropositionTechniqueEtFinancièreSignéeSource,
        dossierProjetTarget: dossierPropositionTechniqueEtFinancièreSignéeDestination,
      },
    });

    await mediator.send<ModifierRéférenceDossierRaccordementCommand>({
      type: 'Réseau.Raccordement.Command.ModifierRéférenceDossierRaccordement',
      data: {
        identifiantGestionnaireRéseau,
        identifiantProjet,
        nouvelleRéférenceDossierRaccordement,
        référenceDossierRaccordementActuelle,
        rôle,
      },
    });

    await mediator.send<AcheverTâcheCommand>({
      type: 'Tâche.Command.AcheverTâche',
      data: {
        identifiantProjet,
        typeTâche: TypeTâche.raccordementRéférenceNonTransmise,
      },
    });
  };

  mediator.register('Réseau.Raccordement.UseCase.ModifierRéférenceDossierRaccordement', runner);
};
