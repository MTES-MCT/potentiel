import { mediator } from 'mediateur';

import { Période } from '@potentiel-domain/periode';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { ListerUtilisateursQuery } from '@potentiel-domain/utilisateur';
import { Candidature } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

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

  const usersOthersThanDGECOrPorteur = await mediator.send<ListerUtilisateursQuery>({
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
      période: période.id,
      appelOffre: appelOffre.id,
      identifiantProjets: identifiantProjetToInclude,
    },
  });

  const porteurs = [
    ...new Set(candidatures.items.map((candidature) => candidature.emailContact.formatter())),
  ];
  const baseUrl = getBaseUrl();

  for (const { email } of usersOthersThanDGECOrPorteur.items) {
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
        redirect_url: baseUrl,
      },
    });
  }

  for (const email of porteurs) {
    const projets = candidatures.items.filter(
      (candidature) => candidature.emailContact.formatter() === email,
    );

    await sendEmail({
      templateId: périodeNotificationTemplateId.notifierPorteur,
      recipients: [
        {
          email,
          fullName: projets[0].nomReprésentantLégal,
        },
      ],
      messageSubject: `Résultats de la ${période.title} période de l'appel d'offres ${appelOffre.id}`,
      variables: {
        redirect_url:
          projets?.length === 1
            ? `${baseUrl}${Routes.Projet.details(projets[0].identifiantProjet.formatter())}`
            : baseUrl,
      },
    });
  }
};
