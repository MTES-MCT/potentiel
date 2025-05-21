import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { DateTime, Email } from '@potentiel-domain/common';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import * as TypeDocumentRaccordement from '../typeDocumentRaccordement.valueType';
import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';

import { TransmettreDemandeComplèteRaccordementCommand } from './transmettreDemandeComplèteRaccordement.command';

export type TransmettreDemandeComplèteRaccordementUseCase = Message<
  'Lauréat.Raccordement.UseCase.TransmettreDemandeComplèteRaccordement',
  {
    identifiantProjetValue: string;
    dateQualificationValue: string;
    référenceDossierValue: string;
    accuséRéceptionValue?: {
      content: ReadableStream;
      format: string;
    };
    transmiseParValue: string;
  }
>;

export const registerTransmettreDemandeComplèteRaccordementUseCase = () => {
  const runner: MessageHandler<TransmettreDemandeComplèteRaccordementUseCase> = async ({
    dateQualificationValue,
    identifiantProjetValue,
    référenceDossierValue,
    accuséRéceptionValue,
    transmiseParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateQualification = DateTime.convertirEnValueType(dateQualificationValue);
    const transmisePar = Email.convertirEnValueType(transmiseParValue);

    /**
     * Merci de laisser la commande transmettre en première puisqu'elle fait des vérifications (notamment sur l'abandon du projet)
     */
    await mediator.send<TransmettreDemandeComplèteRaccordementCommand>({
      type: 'Lauréat.Raccordement.Command.TransmettreDemandeComplèteRaccordement',
      data: {
        identifiantProjet,
        dateQualification,
        référenceDossier: RéférenceDossierRaccordement.convertirEnValueType(référenceDossierValue),
        formatAccuséRéception: accuséRéceptionValue?.format ?? undefined,
        transmisePar,
      },
    });

    if (accuséRéceptionValue) {
      const accuséRéception = DocumentProjet.convertirEnValueType(
        identifiantProjetValue,
        TypeDocumentRaccordement.convertirEnAccuséRéceptionValueType(
          référenceDossierValue,
        ).formatter(),
        dateQualificationValue,
        accuséRéceptionValue.format,
      );

      await mediator.send<EnregistrerDocumentProjetCommand>({
        type: 'Document.Command.EnregistrerDocumentProjet',
        data: {
          content: accuséRéceptionValue.content,
          documentProjet: accuséRéception,
        },
      });
    }
  };

  mediator.register('Lauréat.Raccordement.UseCase.TransmettreDemandeComplèteRaccordement', runner);
};
