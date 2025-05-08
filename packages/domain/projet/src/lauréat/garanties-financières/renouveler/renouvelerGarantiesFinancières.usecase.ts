import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot } from '../../../getProjetAggregateRoot.port';
import { IdentifiantProjet } from '../../..';
import { MotifDemandeGarantiesFinancières } from '..';

export type RenouvelerGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.RenouvelerGarantiesFinancières',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
  }
>;

export type EffacerHistoriqueGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.EffacerHistoriqueGarantiesFinancières',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    effacéPar: Email.ValueType;
    effacéLe: DateTime.ValueType;
  }
>;

export type DemanderGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.DemanderGarantiesFinancières',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateLimiteSoumission: DateTime.ValueType;
    demandéLe: DateTime.ValueType;
    motif: MotifDemandeGarantiesFinancières.ValueType;
  }
>;

export const registerRenouvelerGarantiesFinancièresUseCase = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const runner: MessageHandler<RenouvelerGarantiesFinancièresUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

    const projet = await getProjetAggregateRoot(identifiantProjet);

    if (projet.appelOffre.changementProducteurPossibleAvantAchèvement) {
      const dateActuelle = DateTime.now();

      if (projet.lauréat.garantiesFinancières.aDesGarantiesFinancières) {
        await mediator.send<EffacerHistoriqueGarantiesFinancièresCommand>({
          type: 'Lauréat.GarantiesFinancières.Command.EffacerHistoriqueGarantiesFinancières',
          data: {
            identifiantProjet,
            effacéLe: dateActuelle,
            effacéPar: identifiantUtilisateur,
          },
        });
      }
      await mediator.send<DemanderGarantiesFinancièresCommand>({
        type: 'Lauréat.GarantiesFinancières.Command.DemanderGarantiesFinancières',
        data: {
          demandéLe: dateActuelle,
          identifiantProjet,
          dateLimiteSoumission: dateActuelle.ajouterNombreDeMois(2),
          motif: MotifDemandeGarantiesFinancières.changementProducteur,
        },
      });
    }
  };

  mediator.register('Lauréat.GarantiesFinancières.UseCase.RenouvelerGarantiesFinancières', runner);
};
