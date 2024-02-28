import { mediator, MessageHandler, Message } from 'mediateur';
import { ModifierDemandeComplèteRaccordementCommand } from './modifierDemandeComplèteRaccordement.command';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import * as TypeDocumentRaccordement from '../typeDocumentRaccordement.valueType';
import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';

export type ModifierDemandeComplèteRaccordementUseCase = Message<
  'Réseau.Raccordement.UseCase.ModifierDemandeComplèteRaccordement',
  {
    identifiantProjetValue: string;
    dateQualificationValue: string;
    identifiantGestionnaireRéseauValue: string;
    référenceDossierRaccordementValue: string;
    accuséRéceptionValue: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerModifierDemandeComplèteRaccordementUseCase = () => {
  const runner: MessageHandler<ModifierDemandeComplèteRaccordementUseCase> = async ({
    accuséRéceptionValue: { content, format },
    dateQualificationValue,
    identifiantGestionnaireRéseauValue,
    identifiantProjetValue,
    référenceDossierRaccordementValue,
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
    const identifiantGestionnaireRéseau = IdentifiantGestionnaireRéseau.convertirEnValueType(
      identifiantGestionnaireRéseauValue,
    );
    const référenceDossierRaccordement = RéférenceDossierRaccordement.convertirEnValueType(
      référenceDossierRaccordementValue,
    );

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content,
        documentProjet: accuséRéception,
      },
    });

    await mediator.send<ModifierDemandeComplèteRaccordementCommand>({
      type: 'Réseau.Raccordement.Command.ModifierDemandeComplèteRaccordement',
      data: {
        dateQualification,
        formatAccuséRéception: format,
        identifiantGestionnaireRéseau,
        identifiantProjet,
        référenceDossierRaccordement,
      },
    });
  };

  mediator.register('Réseau.Raccordement.UseCase.ModifierDemandeComplèteRaccordement', runner);
};
