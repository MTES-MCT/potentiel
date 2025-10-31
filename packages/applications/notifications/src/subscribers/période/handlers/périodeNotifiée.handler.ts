import { mediator } from 'mediateur';

import { Période } from '@potentiel-domain/periode';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { ListerUtilisateursQuery } from '@potentiel-domain/utilisateur';
import { Candidature } from '@potentiel-domain/projet';

import { getBaseUrl, NotificationHandlerProps } from '../../../_helpers';
import { périodeNotificationTemplateId } from '../constant';

export const handlePériodeNotifiée = async ({
  event,
  sendEmail,
}: NotificationHandlerProps<Période.PériodeNotifiéeEvent>) => {
  const identifiantPériode = Période.IdentifiantPériode.convertirEnValueType(
    event.payload.identifiantPériode,
  );

  const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
    type: 'AppelOffre.Query.ConsulterAppelOffre',
    data: {
      identifiantAppelOffre: identifiantPériode.appelOffre,
    },
  });

  if (Option.isNone(appelOffre)) {
    getLogger().error(
      new Error(`Pas d'appel d'offre trouvé pour l'identifiant période ${identifiantPériode}`),
    );
    return;
  }

  const période = appelOffre.periodes.find((x) => x.id === identifiantPériode.période);

  if (!période) {
    getLogger().error(
      new Error(
        `Pas de période trouvée pour l'identifiant période ${identifiantPériode.formatter()}`,
      ),
    );
    return;
  }

  const { items: usersOthersThanDGECOrPorteur } = await mediator.send<ListerUtilisateursQuery>({
    type: 'Utilisateur.Query.ListerUtilisateurs',
    data: {
      roles: ['cocontractant', 'ademe', 'caisse-des-dépôts', 'cre', 'dreal'],
      actif: true,
    },
  });

  const identifiantProjetToInclude = [
    ...event.payload.identifiantLauréats,
    ...event.payload.identifiantÉliminés,
  ];

  const candidatures = await mediator.send<Candidature.ListerCandidaturesQuery>({
    type: 'Candidature.Query.ListerCandidatures',
    data: {
      appelOffre: appelOffre.id,
      période: période.id,
      identifiantProjets: identifiantProjetToInclude,
    },
  });

  const porteurs = candidatures.items
    .filter(
      (candidature, i, self) =>
        self.findIndex((x) => x.emailContact === candidature.emailContact) === i,
    )
    .map((porteur) => ({
      email: porteur.emailContact,
      fullName: porteur.nomReprésentantLégal,
    }));

  const redirect_url = `${getBaseUrl()}/projets.html`;

  for (const { email } of usersOthersThanDGECOrPorteur) {
    await sendEmail({
      templateId: périodeNotificationTemplateId.notifierDrealCocontractantAdemeCaisseDesDépôtsCRE,
      recipients: [
        {
          email,
        },
      ],
      messageSubject: `Potentiel - Notification de la période ${période.id} de l'appel d'offres ${appelOffre.id}`,
      variables: {
        appel_offre: appelOffre.id,
        periode: période.id,
        date_notification: new Date(event.payload.notifiéeLe).toLocaleDateString('fr-FR'),
        redirect_url,
      },
    });
  }

  for (const { email, fullName } of porteurs) {
    await sendEmail({
      templateId: périodeNotificationTemplateId.notifierPorteur,
      recipients: [
        {
          email: email.formatter(),
          fullName,
        },
      ],
      messageSubject: `Résultats de la ${période.title} période de l'appel d'offres ${appelOffre.id}`,
      variables: {
        redirect_url,
      },
    });
  }
};
