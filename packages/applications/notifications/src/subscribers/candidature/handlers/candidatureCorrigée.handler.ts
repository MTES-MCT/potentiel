import { mediator } from 'mediateur';

import { Accès, Candidature } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { ListerUtilisateursQuery, Role } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import { getBaseUrl, NotificationHandlerProps } from '../../../_helpers';
import { candidatureNotificationTemplateId } from '../constant';

export const handleCandidatureCorrigée = async ({
  sendEmail,
  event,
}: NotificationHandlerProps<Candidature.CandidatureCorrigéeEvent>) => {
  if (!event.payload.doitRégénérerAttestation) {
    return;
  }

  const utilisateursAvecAccès = await mediator.send<Accès.ConsulterAccèsQuery>({
    type: 'Projet.Accès.Query.ConsulterAccès',
    data: {
      identifiantProjet: event.payload.identifiantProjet,
    },
  });

  if (Option.isNone(utilisateursAvecAccès)) {
    return;
  }

  const identifiantsUtilisateur = utilisateursAvecAccès.utilisateursAyantAccès.map(
    (utilisateur) => utilisateur.email,
  );

  const porteurActifAyantAccès = await mediator.send<ListerUtilisateursQuery>({
    type: 'Utilisateur.Query.ListerUtilisateurs',
    data: {
      identifiantsUtilisateur,
      actif: true,
      roles: [Role.porteur.nom],
    },
  });

  if (porteurActifAyantAccès.items.length === 0) {
    return;
  }

  await sendEmail({
    templateId: candidatureNotificationTemplateId.attestationRegénéréePorteur,
    messageSubject: `Potentiel - Une nouvelle attestation est disponible pour le projet ${event.payload.nomProjet}`,
    recipients: porteurActifAyantAccès.items.map((p) => ({
      email: p.email,
    })),
    variables: {
      nom_projet: event.payload.nomProjet,
      raison: 'Votre candidature a été modifiée',
      redirect_url: `${getBaseUrl()}${Routes.Projet.details(event.payload.identifiantProjet)}`,
    },
  });
};
