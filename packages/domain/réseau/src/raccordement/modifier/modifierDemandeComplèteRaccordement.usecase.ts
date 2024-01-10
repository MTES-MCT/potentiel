import { mediator, MessageHandler, Message } from 'mediateur';
import { ModifierDemandeComplèteRaccordementCommand } from './modifierDemandeComplèteRaccordement.command';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import * as TypeDocumentRaccordement from '../typeDocumentRaccordement.valueType';
import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';

export type ModifierDemandeComplèteRaccordementUseCase = Message<
  'MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
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
      type: 'ENREGISTRER_DOCUMENT_PROJET_COMMAND',
      data: {
        content,
        documentProjet: accuséRéception,
      },
    });

    await mediator.send<ModifierDemandeComplèteRaccordementCommand>({
      type: 'MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
      data: {
        dateQualification,
        formatAccuséRéception: format,
        identifiantGestionnaireRéseau,
        identifiantProjet,
        référenceDossierRaccordement,
      },
    });
  };

  mediator.register('MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE', runner);
};
