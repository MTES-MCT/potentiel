import { Message, MessageHandler, mediator } from 'mediateur';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import * as TypeDocumentRaccordement from '../typeDocumentRaccordement.valueType';
import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';
import { TransmettreDemandeComplèteRaccordementCommand } from './transmettreDemandeComplèteRaccordement.command';

export type TransmettreDemandeComplèteRaccordementUseCase = Message<
  'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
  {
    identifiantProjetValue: string;
    dateQualificationValue: string;
    identifiantGestionnaireRéseauValue: string;
    référenceDossierValue: string;
    accuséRéceptionValue: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerTransmettreDemandeComplèteRaccordementUseCase = () => {
  const runner: MessageHandler<TransmettreDemandeComplèteRaccordementUseCase> = async ({
    dateQualificationValue,
    identifiantGestionnaireRéseauValue,
    identifiantProjetValue,
    référenceDossierValue,
    accuséRéceptionValue: { format, content },
  }) => {
    const accuséRéception = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentRaccordement.convertirEnAccuséRéceptionValueType(
        référenceDossierValue,
      ).formatter(),
      dateQualificationValue,
      format,
    );

    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateQualification = DateTime.convertirEnValueType(dateQualificationValue);
    const identifiantGestionnaireRéseau = IdentifiantGestionnaireRéseau.convertirEnValueType(
      identifiantGestionnaireRéseauValue,
    );

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'ENREGISTRER_DOCUMENT_PROJET_COMMAND',
      data: {
        content,
        documentProjet: accuséRéception,
      },
    });

    await mediator.send<TransmettreDemandeComplèteRaccordementCommand>({
      type: 'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
      data: {
        identifiantProjet,
        identifiantGestionnaireRéseau,
        dateQualification,
        référenceDossier: RéférenceDossierRaccordement.convertirEnValueType(référenceDossierValue),
        formatAccuséRéception: format,
      },
    });
  };

  mediator.register('TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE', runner);
};
