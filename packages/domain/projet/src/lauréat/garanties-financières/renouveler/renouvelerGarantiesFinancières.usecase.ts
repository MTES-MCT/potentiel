import { Message, MessageHandler, mediator } from 'mediateur';

// import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot } from '../../../getProjetAggregateRoot.port';
import { IdentifiantProjet } from '../../..';

export type RenouvelerGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.RenouvelerGarantiesFinancières',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
  }
>;

export const registerRenouvelerGarantiesFinancièresUseCase = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const runner: MessageHandler<RenouvelerGarantiesFinancièresUseCase> = async ({
    identifiantProjetValue,
    // identifiantUtilisateurValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    // const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

    const projet = await getProjetAggregateRoot(identifiantProjet);

    if (projet.appelOffre.changementProducteurPossibleAvantAchèvement) {
      // const dateActuelle = DateTime.now();

      if (projet.lauréat.garantiesFinancières.aDesGarantiesFinancières) {
        //   await mediator.send<GarantiesFinancières.EffacerHistoriqueGarantiesFinancièresCommand>({
        //     type: 'Lauréat.GarantiesFinancières.Command.EffacerHistoriqueGarantiesFinancières',
        //     data: {
        //       identifiantProjet,
        //       effacéLe: dateActuelle,
        //       effacéPar: identifiantUtilisateur,
        //     },
        //   });
        // }
        // await mediator.send<GarantiesFinancières.DemanderGarantiesFinancièresCommand>({
        //   type: 'Lauréat.GarantiesFinancières.Command.DemanderGarantiesFinancières',
        //   data: {
        //     demandéLe: dateActuelle,
        //     identifiantProjet,
        //     dateLimiteSoumission: dateActuelle.ajouterNombreDeMois(2),
        //     motif: GarantiesFinancières.MotifDemandeGarantiesFinancières.changementProducteur,
        //   },
        // });
      }
    }
  };

  mediator.register('Lauréat.GarantiesFinancières.UseCase.RenouvelerGarantiesFinancières', runner);
};
