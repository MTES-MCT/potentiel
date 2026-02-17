import { mediator, MessageHandler, Message } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import * as TypeDocumentRaccordement from '../../typeDocumentRaccordement.valueType.js';
import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';
import { DocumentProjet, IdentifiantProjet } from '../../../../index.js';
import { EnregistrerDocumentProjetCommand } from '../../../../document-projet/index.js';

import { ModifierDemandeComplèteRaccordementCommand } from './modifierDemandeComplèteRaccordement.command.js';

export type ModifierDemandeComplèteRaccordementUseCase = Message<
  'Lauréat.Raccordement.UseCase.ModifierDemandeComplèteRaccordement',
  {
    identifiantProjetValue: string;
    dateQualificationValue: string;
    référenceDossierRaccordementValue: string;
    rôleValue: string;
    accuséRéceptionValue: {
      content: ReadableStream;
      format: string;
    };
    modifiéeLeValue: string;
    modifiéeParValue: string;
  }
>;

export const registerModifierDemandeComplèteRaccordementUseCase = () => {
  const runner: MessageHandler<ModifierDemandeComplèteRaccordementUseCase> = async ({
    accuséRéceptionValue: { content, format },
    dateQualificationValue,
    identifiantProjetValue,
    référenceDossierRaccordementValue,
    rôleValue,
    modifiéeLeValue,
    modifiéeParValue,
  }) => {
    const accuséRéception = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentRaccordement.convertirEnAccuséRéceptionValueType(
        référenceDossierRaccordementValue,
      ).formatter(),
      dateQualificationValue,
      format,
    );

    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateQualification = DateTime.convertirEnValueType(dateQualificationValue);
    const référenceDossierRaccordement = RéférenceDossierRaccordement.convertirEnValueType(
      référenceDossierRaccordementValue,
    );
    const rôle = Role.convertirEnValueType(rôleValue);
    const modifiéeLe: DateTime.ValueType = DateTime.convertirEnValueType(modifiéeLeValue);
    const modifiéePar = Email.convertirEnValueType(modifiéeParValue);

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content,
        documentProjet: accuséRéception,
      },
    });

    await mediator.send<ModifierDemandeComplèteRaccordementCommand>({
      type: 'Lauréat.Raccordement.Command.ModifierDemandeComplèteRaccordement',
      data: {
        dateQualification,
        formatAccuséRéception: format,
        identifiantProjet,
        référenceDossierRaccordement,
        rôle,
        modifiéeLe,
        modifiéePar,
      },
    });
  };

  mediator.register('Lauréat.Raccordement.UseCase.ModifierDemandeComplèteRaccordement', runner);
};
