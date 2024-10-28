import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Recours } from '@potentiel-domain/elimine';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';

import { NotifierLauréatCommand } from './notifier/notifierLauréat.command';
import { DemanderGarantiesFinancièresCommand } from './garantiesFinancières/demander/demanderGarantiesFinancières.command';
import { MotifDemandeGarantiesFinancières } from './garantiesFinancières';
import { appelOffreSoumisAuxGarantiesFinancières } from './garantiesFinancières/utils/appelOffreSoumisAuxGarantiesFinancières';

export type SubscriptionEvent = Recours.RecoursAccordéEvent;

export type Execute = Message<'System.Lauréat.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const {
      payload: { identifiantProjet },
    } = event;
    switch (event.type) {
      case 'RecoursAccordé-V1':
        const {
          accordéLe,
          accordéPar,
          réponseSignée: { format },
        } = event.payload;

        const identifiantProjetValueType =
          IdentifiantProjet.convertirEnValueType(identifiantProjet);

        await mediator.send<NotifierLauréatCommand>({
          type: 'Lauréat.Command.NotifierLauréat',
          data: {
            identifiantProjet: identifiantProjetValueType,
            notifiéLe: DateTime.convertirEnValueType(accordéLe),
            notifiéPar: Email.convertirEnValueType(accordéPar),
            attestation: { format },
          },
        });

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
