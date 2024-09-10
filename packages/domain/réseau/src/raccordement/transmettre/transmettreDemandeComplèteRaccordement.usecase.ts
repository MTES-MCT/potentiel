import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { InvalidOperationError, LoadAggregate } from '@potentiel-domain/core';
import { Abandon } from '@potentiel-domain/laureat';

import * as TypeDocumentRaccordement from '../typeDocumentRaccordement.valueType';
import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';

import { TransmettreDemandeComplèteRaccordementCommand } from './transmettreDemandeComplèteRaccordement.command';

export type TransmettreDemandeComplèteRaccordementUseCase = Message<
  'Réseau.Raccordement.UseCase.TransmettreDemandeComplèteRaccordement',
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

export const registerTransmettreDemandeComplèteRaccordementUseCase = (
  loadAggregate: LoadAggregate,
) => {
  const runner: MessageHandler<TransmettreDemandeComplèteRaccordementUseCase> = async ({
    dateQualificationValue,
    identifiantGestionnaireRéseauValue,
    identifiantProjetValue,
    référenceDossierValue,
    accuséRéceptionValue: { format, content },
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const loadAbandon = await Abandon.loadAbandonFactory(loadAggregate);
    const abandon = await loadAbandon(identifiantProjet);

    if (abandon.accord?.accordéLe) {
      throw new ProjetAbandonnéError();
    }

    const accuséRéception = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentRaccordement.convertirEnAccuséRéceptionValueType(
        référenceDossierValue,
      ).formatter(),
      dateQualificationValue,
      format,
    );

    const dateQualification = DateTime.convertirEnValueType(dateQualificationValue);
    const identifiantGestionnaireRéseau = IdentifiantGestionnaireRéseau.convertirEnValueType(
      identifiantGestionnaireRéseauValue,
    );

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content,
        documentProjet: accuséRéception,
      },
    });

    await mediator.send<TransmettreDemandeComplèteRaccordementCommand>({
      type: 'Réseau.Raccordement.Command.TransmettreDemandeComplèteRaccordement',
      data: {
        identifiantProjet,
        identifiantGestionnaireRéseau,
        dateQualification,
        référenceDossier: RéférenceDossierRaccordement.convertirEnValueType(référenceDossierValue),
        formatAccuséRéception: format,
      },
    });
  };

  mediator.register('Réseau.Raccordement.UseCase.TransmettreDemandeComplèteRaccordement', runner);
};

class ProjetAbandonnéError extends InvalidOperationError {
  constructor() {
    super(
      'Impossible de transmettre une demande complète de raccordement pour un projet abandonné',
    );
  }
}
