import { Message, MessageHandler, mediator } from 'mediateur';

import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  récupérerDrealsParIdentifiantProjetAdapter,
  récupérerPorteursParIdentifiantProjetAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { Routes } from '@potentiel-applications/routes';
import { TypeTâchePlanifiée, TâchePlanifiéeExecutéeEvent } from '@potentiel-domain/tache-planifiee';
import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

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
    const typeTâchePlanifiée = TypeTâchePlanifiée.convertirEnValueType(payload.typeTâchePlanifiée);

    switch (payload.typeTâchePlanifiée) {
      case 'garanties-financières.rappel-échéance-un-mois':
      case 'garanties-financières.rappel-échéance-deux-mois':
        const {
          nom,
          localité: { département },
        } = await mediator.send<ConsulterCandidatureQuery>({
          type: 'Candidature.Query.ConsulterCandidature',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });

        const porteurs = await récupérerPorteursParIdentifiantProjetAdapter(identifiantProjet);
        const dreals = await récupérerDrealsParIdentifiantProjetAdapter(identifiantProjet);
        const nombreDeMois =
          typeTâchePlanifiée.type ===
          GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.rappelÉchéanceUnMois.type
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
          templateId: 6164049,
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
