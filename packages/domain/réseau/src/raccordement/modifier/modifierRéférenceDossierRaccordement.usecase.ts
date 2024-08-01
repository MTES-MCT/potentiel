import { mediator, MessageHandler, Message } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';
import { DossierProjet, DéplacerDocumentProjetCommand } from '@potentiel-domain/document';
import { AcheverTâcheCommand } from '@potentiel-domain/tache';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import * as TypeDocumentRaccordement from '../typeDocumentRaccordement.valueType';
import * as TypeTâcheRaccordement from '../typeTâcheRaccordement.valueType';

import { ModifierRéférenceDossierRaccordementCommand } from './modifierRéférenceDossierRaccordement.command';

export type ModifierRéférenceDossierRaccordementUseCase = Message<
  'Réseau.Raccordement.UseCase.ModifierRéférenceDossierRaccordement',
  {
    identifiantProjetValue: string;
    référenceDossierRaccordementActuelleValue: string;
    nouvelleRéférenceDossierRaccordementValue: string;
    rôleValue: string;
  }
>;

export const registerModifierRéférenceDossierRaccordementUseCase = () => {
  const runner: MessageHandler<ModifierRéférenceDossierRaccordementUseCase> = async ({
    identifiantProjetValue,
    nouvelleRéférenceDossierRaccordementValue,
    référenceDossierRaccordementActuelleValue,
    rôleValue,
  }) => {
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
        identifiantProjet,
        nouvelleRéférenceDossierRaccordement,
        référenceDossierRaccordementActuelle,
        rôle,
      },
    });

    await mediator.send<AcheverTâcheCommand>({
      type: 'System.Tâche.Command.AcheverTâche',
      data: {
        identifiantProjet,
        typeTâche: TypeTâcheRaccordement.raccordementRéférenceNonTransmise,
      },
    });
  };

  mediator.register('Réseau.Raccordement.UseCase.ModifierRéférenceDossierRaccordement', runner);
};
