import { mediator, MessageHandler, Message } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType';
import * as TypeDocumentRaccordement from '../../typeDocumentRaccordement.valueType';
import { DossierProjet, DéplacerDocumentProjetCommand } from '../../../../document-projet';

import { ModifierRéférenceDossierRaccordementCommand } from './modifierRéférenceDossierRaccordement.command';

export type ModifierRéférenceDossierRaccordementUseCase = Message<
  'Lauréat.Raccordement.UseCase.ModifierRéférenceDossierRaccordement',
  {
    identifiantProjetValue: string;
    référenceDossierRaccordementActuelleValue: string;
    nouvelleRéférenceDossierRaccordementValue: string;
    rôleValue: string;
    modifiéeLeValue: string;
    modifiéeParValue: string;
  }
>;

export const registerModifierRéférenceDossierRaccordementUseCase = () => {
  const runner: MessageHandler<ModifierRéférenceDossierRaccordementUseCase> = async ({
    identifiantProjetValue,
    nouvelleRéférenceDossierRaccordementValue,
    référenceDossierRaccordementActuelleValue,
    modifiéeLeValue,
    modifiéeParValue,
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
    const modifiéeLe = DateTime.convertirEnValueType(modifiéeLeValue);
    const modifiéePar = Email.convertirEnValueType(modifiéeParValue);

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
      type: 'Lauréat.Raccordement.Command.ModifierRéférenceDossierRaccordement',
      data: {
        identifiantProjet,
        nouvelleRéférenceDossierRaccordement,
        référenceDossierRaccordementActuelle,
        modifiéeLe,
        modifiéePar,
        rôle,
      },
    });
  };

  mediator.register('Lauréat.Raccordement.UseCase.ModifierRéférenceDossierRaccordement', runner);
};
