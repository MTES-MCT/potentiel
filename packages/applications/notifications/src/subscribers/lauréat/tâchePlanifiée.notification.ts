import { Message, MessageHandler, mediator } from 'mediateur';

import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  récupérerDrealsParIdentifiantProjetAdapter,
  récupérerPorteursParIdentifiantProjetAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { Routes } from '@potentiel-applications/routes';
import { TâchePlanifiéeExecutéeEvent } from '@potentiel-domain/tache-planifiee';
import { Candidature } from '@potentiel-domain/candidature';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';

import { SendEmail } from '../../sendEmail';

export type SubscriptionEvent = TâchePlanifiéeExecutéeEvent & Event;

export type Execute = Message<'System.Notification.TâchePlanifiée', SubscriptionEvent>;

const templateId = {
  garantiesFinancièreÉchéanceDreal: 6164034,
  garantiesFinancièreÉchéancePorteur: 6164049,
} as const;

export type RegisterTâchePlanifiéeNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterTâchePlanifiéeNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async ({ payload }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);

    switch (payload.typeTâchePlanifiée) {
      case 'garanties-financières.rappel-échéance-un-mois':
      case 'garanties-financières.rappel-échéance-deux-mois':
        const candidature = await mediator.send<Candidature.ConsulterProjetQuery>({
          type: 'Candidature.Query.ConsulterProjet',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });

        if (Option.isNone(candidature)) {
          getLogger('System.Notification.TâchePlanifiée').error(
            new Error(`Pas de candidature lié au projet ${identifiantProjet.formatter()}`),
          );
          return;
        }

        const {
          nom,
          localité: { département },
        } = candidature;

        const porteurs = await récupérerPorteursParIdentifiantProjetAdapter(identifiantProjet);
        const dreals = await récupérerDrealsParIdentifiantProjetAdapter(identifiantProjet);
        const nombreDeMois =
          payload.typeTâchePlanifiée === 'garanties-financières.rappel-échéance-un-mois'
            ? '1'
            : '2';

        const { BASE_URL } = process.env;

        await sendEmail({
          messageSubject: `Potentiel - Arrivée à échéance des garanties financières pour le projet ${nom} dans ${nombreDeMois} mois`,
          recipients: dreals,
          templateId: templateId.garantiesFinancièreÉchéanceDreal,
          variables: {
            nom_projet: nom,
            departement_projet: département,
            nombre_mois: nombreDeMois,
            url: `${BASE_URL}${Routes.GarantiesFinancières.détail(identifiantProjet.formatter())}`,
          },
        });

        await sendEmail({
          messageSubject: `Potentiel - Arrivée à échéance de vos garanties financières pour le projet ${nom} arrivent à échéance dans ${nombreDeMois} mois`,
          recipients: porteurs,
          templateId: templateId.garantiesFinancièreÉchéancePorteur,
          variables: {
            nom_projet: nom,
            departement_projet: département,
            nombre_mois: nombreDeMois,
            url: `${BASE_URL}${Routes.GarantiesFinancières.détail(identifiantProjet.formatter())}`,
          },
        });
    }
  };

  mediator.register('System.Notification.TâchePlanifiée', handler);
};
