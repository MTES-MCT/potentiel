import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import type { DéplacerDossierProjetCommand } from '../../../../document-projet/index.js';
import { IdentifiantProjet } from '../../../../index.js';
import { DocumentRaccordement, TypeDocumentsRaccordement } from '../../index.js';
import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';
import type { ModifierTypeDocumentCommand } from './modifierTypeDocumentRaccordement.command.js';

export type ModifierTypeDocumentUseCase = Message<
  'Lauréat.Raccordement.UseCase.ModifierTypeDocument',
  {
    référenceDossierRaccordementValue: string;
    identifiantProjetValue: string;
    modifiéLeValue: string;
    modifiéParValue: string;
    ancienTypeValue: string;
    nouveauTypeValue: string;
  }
>;

export const registerModifierTypeDocumentUseCase = () => {
  const runner: MessageHandler<ModifierTypeDocumentUseCase> = async ({
    identifiantProjetValue,
    référenceDossierRaccordementValue,
    ancienTypeValue,
    nouveauTypeValue,
    modifiéLeValue,
    modifiéParValue,
  }) => {
    const ancienTypeDocument = TypeDocumentsRaccordement.convertirEnValueType(ancienTypeValue);
    const nouveauTypeDocument = TypeDocumentsRaccordement.convertirEnValueType(nouveauTypeValue);

    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const référenceDossierRaccordement = RéférenceDossierRaccordement.convertirEnValueType(
      référenceDossierRaccordementValue,
    );

    await mediator.send<ModifierTypeDocumentCommand>({
      type: 'Lauréat.Raccordement.Command.ModifierTypeDocument',
      data: {
        identifiantProjet,
        référenceDossierRaccordement,
        modifiéLe: DateTime.convertirEnValueType(modifiéLeValue),
        modifiéPar: Email.convertirEnValueType(modifiéParValue),
        ancienType: ancienTypeDocument,
        nouveauType: nouveauTypeDocument,
      },
    });

    const dossier = DocumentRaccordement.dossierProjetRaccordement(
      identifiantProjet.formatter(),
      référenceDossierRaccordement.formatter(),
    );

    await mediator.send<DéplacerDossierProjetCommand>({
      type: 'Document.Command.DéplacerDossierProjet',
      data: {
        dossierProjetSource:
          dossier[
            TypeDocumentsRaccordement.mapDocumentTypeToEntityKey(ancienTypeDocument.formatter())
          ],
        dossierProjetTarget:
          dossier[
            TypeDocumentsRaccordement.mapDocumentTypeToEntityKey(nouveauTypeDocument.formatter())
          ],
      },
    });
  };

  mediator.register('Lauréat.Raccordement.UseCase.ModifierTypeDocument', runner);
};
