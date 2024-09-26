import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Candidature } from '@potentiel-domain/candidature';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { ConsulterUtilisateurQuery } from '@potentiel-domain/utilisateur';

import { buildCertificate } from './buildCertificate';

export type SubscriptionEvent = Candidature.CandidatureNotifiéeEvent;

export type Execute = Message<'System.Candidature.Attestation.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const logger = getLogger('System.Candidature.Attestation.Saga.Execute');
    const {
      payload: {
        identifiantProjet,
        attestation: { format },
        notifiéeLe,
        notifiéePar,
      },
    } = event;
    switch (event.type) {
      case 'CandidatureNotifiée-V1':
        const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
          type: 'Candidature.Query.ConsulterCandidature',
          data: {
            identifiantProjet,
          },
        });

        if (Option.isNone(candidature)) {
          logger.warn(`Candidature non trouvée`, { identifiantProjet });
          return;
        }

        const appelOffres = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
          type: 'AppelOffre.Query.ConsulterAppelOffre',
          data: { identifiantAppelOffre: candidature.identifiantProjet.appelOffre },
        });

        if (Option.isNone(appelOffres)) {
          logger.warn(`Appel d'offres non trouvé`, { identifiantProjet });
          return;
        }

        const période = appelOffres.periodes.find(
          (x) => x.id === candidature.identifiantProjet.période,
        );

        if (!période) {
          logger.warn(`Période non trouvée`, { identifiantProjet });
          return;
        }

        const modèleAttestationNonDisponible = période.type === 'legacy';

        if (modèleAttestationNonDisponible) {
          logger.warn(`Le modèle d'attestation n'est pas disponible`, {
            identifiantProjet,
            période,
          });
          return;
        }

        const utilisateur = await mediator.send<ConsulterUtilisateurQuery>({
          type: 'Utilisateur.Query.ConsulterUtilisateur',
          data: {
            identifiantUtilisateur: notifiéePar,
          },
        });

        if (Option.isNone(utilisateur)) {
          logger.warn(`Utilisateur non trouvé`, {
            identifiantProjet,
            identifiantUtilisateur: notifiéePar,
          });
          return;
        }

        const certificate = await buildCertificate({
          appelOffre: appelOffres,
          période,
          utilisateur,
          candidature,
          notifiéLe: notifiéeLe,
        });

        if (!certificate) {
          logger.warn(`Impossible de générer l'attestation du projet ${identifiantProjet}`);
          return;
        }

        const attestation = DocumentProjet.convertirEnValueType(
          identifiantProjet,
          'attestation',
          notifiéeLe,
          format,
        );

        await mediator.send<EnregistrerDocumentProjetCommand>({
          type: 'Document.Command.EnregistrerDocumentProjet',
          data: {
            content: certificate,
            documentProjet: attestation,
          },
        });

        break;
    }
  };
  mediator.register('System.Candidature.Attestation.Saga.Execute', handler);
};
