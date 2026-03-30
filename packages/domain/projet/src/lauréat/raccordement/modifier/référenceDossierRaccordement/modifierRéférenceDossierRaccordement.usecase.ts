import { mediator, MessageHandler, Message } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';
import { DéplacerDossierProjetCommand } from '../../../../document-projet/index.js';
import { IdentifiantProjet } from '../../../../index.js';
import { DocumentRaccordement } from '../../index.js';

import { ModifierRéférenceDossierRaccordementCommand } from './modifierRéférenceDossierRaccordement.command.js';

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

    const dossierProjetActuelRaccordement = DocumentRaccordement.dossierProjetRaccordement(
      identifiantProjetValue,
      référenceDossierRaccordementActuelleValue,
    );
    const nouveauDossierProjetRaccordement = DocumentRaccordement.dossierProjetRaccordement(
      identifiantProjetValue,
      nouvelleRéférenceDossierRaccordementValue,
    );

    await mediator.send<DéplacerDossierProjetCommand>({
      type: 'Document.Command.DéplacerDossierProjet',
      data: {
        dossierProjetSource: dossierProjetActuelRaccordement.accuséRéception,
        dossierProjetTarget: nouveauDossierProjetRaccordement.accuséRéception,
      },
    });

    await mediator.send<DéplacerDossierProjetCommand>({
      type: 'Document.Command.DéplacerDossierProjet',
      data: {
        dossierProjetSource: dossierProjetActuelRaccordement.propositionTechniqueEtFinancière,
        dossierProjetTarget: nouveauDossierProjetRaccordement.propositionTechniqueEtFinancière,
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
