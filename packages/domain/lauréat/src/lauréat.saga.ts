import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Éliminé } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';

import { DemanderGarantiesFinancièresCommand } from './garantiesFinancières/demander/demanderGarantiesFinancières.command';
import { MotifDemandeGarantiesFinancières } from './garantiesFinancières';
import { appelOffreSoumisAuxGarantiesFinancières } from './garantiesFinancières/_utils/appelOffreSoumisAuxGarantiesFinancières';

/**
 * @deprecated
 */
export type SubscriptionEvent = Éliminé.Recours.RecoursAccordéEvent;

/**
 * @deprecated
 */
export type Execute = Message<'System.Lauréat.Saga.Execute', SubscriptionEvent>;

/**
 * @deprecated
 */
export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const {
      payload: { identifiantProjet },
    } = event;
    switch (event.type) {
      case 'RecoursAccordé-V1':
        const { accordéLe } = event.payload;

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
              motif: MotifDemandeGarantiesFinancières.recoursAccordé,
            },
          });
        }

        break;
    }
  };
  mediator.register('System.Lauréat.Saga.Execute', handler);
};
