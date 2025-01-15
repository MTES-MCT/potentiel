import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { AnnulerTâchePlanifiéeCommand } from '@potentiel-domain/tache-planifiee';

import { TypeTâchePlanifiéeChangementReprésentantLégal } from '../..';

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

    await mediator.send<AnnulerChangementReprésentantLégalCommand>({
      type: 'Lauréat.ReprésentantLégal.Command.AnnulerChangementReprésentantLégal',
      data: {
        identifiantProjet,
        identifiantUtilisateur,
        dateAnnulation,
      },
    });

    await mediator.send<AnnulerTâchePlanifiéeCommand>({
      type: 'System.TâchePlanifiée.Command.AnnulerTâchePlanifiée',
      data: {
        identifiantProjet,
        typeTâchePlanifiée:
          TypeTâchePlanifiéeChangementReprésentantLégal.gestionAutomatiqueDemandeChangement.type,
      },
    });

    await mediator.send<AnnulerTâchePlanifiéeCommand>({
      type: 'System.TâchePlanifiée.Command.AnnulerTâchePlanifiée',
      data: {
        identifiantProjet,
        typeTâchePlanifiée:
          TypeTâchePlanifiéeChangementReprésentantLégal.rappelInstructionÀDeuxMois.type,
      },
    });
  };

  mediator.register('Lauréat.ReprésentantLégal.UseCase.AnnulerChangementReprésentantLégal', runner);
};
