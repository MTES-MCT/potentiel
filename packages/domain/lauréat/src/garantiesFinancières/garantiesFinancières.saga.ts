import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { TâchePlanifiéeExecutéeEvent } from '@potentiel-domain/tache-planifiee';
import { Lauréat, Éliminé } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';

import { ÉchoirGarantiesFinancièresCommand } from './garantiesFinancièresActuelles/échoir/échoirGarantiesFinancières.command';
import * as TypeTâchePlanifiéeGarantiesFinancières from './typeTâchePlanifiéeGarantiesFinancières.valueType';
import { DemanderGarantiesFinancièresCommand } from './demander/demanderGarantiesFinancières.command';
import { appelOffreSoumisAuxGarantiesFinancières } from './_utils/appelOffreSoumisAuxGarantiesFinancières';

export type SubscriptionEvent =
  | TâchePlanifiéeExecutéeEvent
  | Éliminé.Recours.RecoursAccordéEvent
  | Lauréat.Producteur.ChangementProducteurEnregistréEvent;

export type Execute = Message<
  'System.Lauréat.GarantiesFinancières.Saga.Execute',
  SubscriptionEvent
>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with(
        { type: 'TâchePlanifiéeExecutée-V1' },
        async ({ payload: { identifiantProjet, typeTâchePlanifiée } }) => {
          if (typeTâchePlanifiée === TypeTâchePlanifiéeGarantiesFinancières.échoir.type) {
            await mediator.send<ÉchoirGarantiesFinancièresCommand>({
              type: 'Lauréat.GarantiesFinancières.Command.ÉchoirGarantiesFinancières',
              data: {
                identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
              },
            });
          }
        },
      )
      .with({ type: 'RecoursAccordé-V1' }, async (event) => {
        const {
          payload: { identifiantProjet, accordéLe },
        } = event;
        const identifiantProjetValueType =
          IdentifiantProjet.convertirEnValueType(identifiantProjet);

        await demanderGarantiesFinancières({
          identifiantProjet: identifiantProjetValueType,
          demandéLe: DateTime.convertirEnValueType(accordéLe),
          motif: Lauréat.GarantiesFinancières.MotifDemandeGarantiesFinancières.recoursAccordé,
        });
      })
      .with({ type: 'ChangementProducteurEnregistré-V1' }, async (event) => {
        const {
          payload: { identifiantProjet, enregistréLe },
        } = event;
        const identifiantProjetValueType =
          IdentifiantProjet.convertirEnValueType(identifiantProjet);

        await demanderGarantiesFinancières({
          identifiantProjet: identifiantProjetValueType,
          demandéLe: DateTime.convertirEnValueType(enregistréLe),
          motif: Lauréat.GarantiesFinancières.MotifDemandeGarantiesFinancières.changementProducteur,
        });
      })
      .exhaustive();
  mediator.register('System.Lauréat.GarantiesFinancières.Saga.Execute', handler);
};

const demanderGarantiesFinancières = async ({
  identifiantProjet,
  demandéLe,
  motif,
}: Omit<DemanderGarantiesFinancièresCommand['data'], 'dateLimiteSoumission'>) => {
  const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
    type: 'AppelOffre.Query.ConsulterAppelOffre',
    data: {
      identifiantAppelOffre: identifiantProjet.appelOffre,
    },
  });

  if (
    Option.isSome(appelOffre) &&
    appelOffreSoumisAuxGarantiesFinancières({
      appelOffre,
      période: identifiantProjet.période,
      famille: identifiantProjet.famille,
    })
  ) {
    await mediator.send<DemanderGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.DemanderGarantiesFinancières',
      data: {
        demandéLe,
        identifiantProjet,
        dateLimiteSoumission: demandéLe.ajouterNombreDeMois(2),
        motif,
      },
    });
  }
};
