import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import * as TypeDocumentRaccordement from '../typeDocumentRaccordement.valueType';
import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';

import { TransmettreDemandeComplèteRaccordementCommand } from './transmettreDemandeComplèteRaccordement.command';

export type TransmettreDemandeComplèteRaccordementUseCase = Message<
  'Réseau.Raccordement.UseCase.TransmettreDemandeComplèteRaccordement',
  {
    identifiantProjetValue: string;
    dateQualificationValue: string;
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

    /**
     * Merci de laisser la commande transmettre en première puisqu'elle fait des vérifications (notamment sur l'abandon du projet)
     */
    await mediator.send<TransmettreDemandeComplèteRaccordementCommand>({
      type: 'Réseau.Raccordement.Command.TransmettreDemandeComplèteRaccordement',
      data: {
        identifiantProjet,
        dateQualification,
        référenceDossier: RéférenceDossierRaccordement.convertirEnValueType(référenceDossierValue),
        formatAccuséRéception: format,
      },
    });

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content,
        documentProjet: accuséRéception,
      },
    });
  };

  mediator.register('Réseau.Raccordement.UseCase.TransmettreDemandeComplèteRaccordement', runner);
};
