import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat, Éliminé } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';

import { DemanderGarantiesFinancièresCommand } from './garantiesFinancières/demander/demanderGarantiesFinancières.command';
import { appelOffreSoumisAuxGarantiesFinancières } from './garantiesFinancières/_utils/appelOffreSoumisAuxGarantiesFinancières';

/**
 * @deprecated
 */
export type SubscriptionEvent =
  | Éliminé.Recours.RecoursAccordéEvent
  | Lauréat.Producteur.ChangementProducteurEnregistréEvent;

/**
 * @deprecated
 */
export type Execute = Message<'System.Lauréat.Saga.Execute', SubscriptionEvent>;

/**
 * @deprecated
 */
export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'RecoursAccordé-V1' }, async (event) => {
        const {
          payload: { identifiantProjet, accordéLe },
        } = event;
        const identifiantProjetValueType =
          IdentifiantProjet.convertirEnValueType(identifiantProjet);

        const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
          type: 'AppelOffre.Query.ConsulterAppelOffre',
          data: {
            identifiantAppelOffre: identifiantProjetValueType.appelOffre,
          },
        });

        if (
          Option.isSome(appelOffre) &&
          appelOffreSoumisAuxGarantiesFinancières({
            appelOffre,
            période: identifiantProjetValueType.période,
            famille: identifiantProjetValueType.famille,
          })
        ) {
          await mediator.send<DemanderGarantiesFinancièresCommand>({
            type: 'Lauréat.GarantiesFinancières.Command.DemanderGarantiesFinancières',
            data: {
              demandéLe: DateTime.convertirEnValueType(accordéLe),
              identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
              dateLimiteSoumission: DateTime.convertirEnValueType(accordéLe).ajouterNombreDeMois(2),
              motif: Lauréat.GarantiesFinancières.MotifDemandeGarantiesFinancières.recoursAccordé,
            },
          });
        }
      })
      .with({ type: 'ChangementProducteurEnregistré-V1' }, async (event) => {
        const {
          payload: { identifiantProjet, enregistréLe },
        } = event;
        const identifiantProjetValueType =
          IdentifiantProjet.convertirEnValueType(identifiantProjet);

        const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
          type: 'AppelOffre.Query.ConsulterAppelOffre',
          data: {
            identifiantAppelOffre: identifiantProjetValueType.appelOffre,
          },
        });

        if (
          Option.isSome(appelOffre) &&
          appelOffreSoumisAuxGarantiesFinancières({
            appelOffre,
            période: identifiantProjetValueType.période,
            famille: identifiantProjetValueType.famille,
          })
        ) {
          await mediator.send<DemanderGarantiesFinancièresCommand>({
            type: 'Lauréat.GarantiesFinancières.Command.DemanderGarantiesFinancières',
            data: {
              demandéLe: DateTime.convertirEnValueType(enregistréLe),
              identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
              dateLimiteSoumission:
                DateTime.convertirEnValueType(enregistréLe).ajouterNombreDeMois(2),
              motif:
                Lauréat.GarantiesFinancières.MotifDemandeGarantiesFinancières.changementProducteur,
            },
          });
        }
      })
      .exhaustive();

  mediator.register('System.Lauréat.Saga.Execute', handler);
};
