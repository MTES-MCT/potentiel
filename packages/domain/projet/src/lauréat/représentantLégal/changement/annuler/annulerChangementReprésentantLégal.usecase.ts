import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { SupprimerDocumentProjetSensibleCommand } from '../supprimerDocumentSensible/supprimerDocumentProjetSensible.command';
import { IdentifiantProjet } from '../../../..';

import { AnnulerChangementReprésentantLégalCommand } from './annulerChangementReprésentantLégal.command';

export type AnnulerChangementReprésentantLégalUseCase = Message<
  'Lauréat.ReprésentantLégal.UseCase.AnnulerChangementReprésentantLégal',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    dateAnnulationValue: string;
  }
>;

export const registerAnnulerChangementReprésentantLégalUseCase = () => {
  const runner: MessageHandler<AnnulerChangementReprésentantLégalUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    dateAnnulationValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);
    const dateAnnulation = DateTime.convertirEnValueType(dateAnnulationValue);

    await mediator.send<SupprimerDocumentProjetSensibleCommand>({
      type: 'Lauréat.ReprésentantLégal.Command.SupprimerDocumentProjetSensible',
      data: {
        identifiantProjet,
        raison: 'Pièce justificative supprimée automatiquement après annulation',
      },
    });

    await mediator.send<AnnulerChangementReprésentantLégalCommand>({
      type: 'Lauréat.ReprésentantLégal.Command.AnnulerChangementReprésentantLégal',
      data: {
        identifiantProjet,
        identifiantUtilisateur,
        dateAnnulation,
      },
    });
  };

  mediator.register('Lauréat.ReprésentantLégal.UseCase.AnnulerChangementReprésentantLégal', runner);
};
