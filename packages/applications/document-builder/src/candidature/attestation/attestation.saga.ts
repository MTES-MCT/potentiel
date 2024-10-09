import { Message, MessageHandler, mediator } from 'mediateur';

import {
  CorrigerDocumentProjetCommand,
  DocumentProjet,
  EnregistrerDocumentProjetCommand,
} from '@potentiel-domain/document';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Candidature } from '@potentiel-domain/candidature';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { ConsulterUtilisateurQuery } from '@potentiel-domain/utilisateur';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { buildCertificate } from './buildCertificate';

export type SubscriptionEvent =
  | Candidature.CandidatureNotifiéeEvent
  | Candidature.CandidatureCorrigéeEvent;

export type Execute = Message<'System.Candidature.Attestation.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const logger = getLogger('System.Candidature.Attestation.Saga.Execute');

    const {
      payload: { identifiantProjet },
    } = event;

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

    switch (event.type) {
      case 'CandidatureNotifiée-V1':
        const {
          payload: {
            attestation: { format },
            notifiéeLe,
            notifiéePar,
          },
        } = event;

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

      case 'CandidatureCorrigée-V1':
        // la correction d'une candidature ne peut pas modifier le champs notification
        // on peut donc sans crainte utiliser cette vérification
        if (!candidature.notification?.notifiéeLe) {
          logger.info(`L'attestation ne sera pas regénérée car la candidature n'est pas notifiée`, {
            identifiantProjet,
          });
          return;
        } else if (event.payload.doitRégénérerAttestation !== true) {
          logger.info(`L'attestation ne sera pas regénérée`, {
            identifiantProjet,
          });
          return;
        } else {
          const utilisateur = await mediator.send<ConsulterUtilisateurQuery>({
            type: 'Utilisateur.Query.ConsulterUtilisateur',
            data: {
              identifiantUtilisateur: candidature.notification.notifiéePar.formatter(),
            },
          });

          if (Option.isNone(utilisateur)) {
            logger.warn(`Utilisateur non trouvé`, {
              identifiantProjet,
              identifiantUtilisateur: candidature.notification.notifiéePar.formatter(),
            });
            return;
          }

          const candidatureCorrigée = {
            ...event.payload,
            misÀJourLe: DateTime.convertirEnValueType(event.payload.corrigéLe),
            détailsImport: candidature.détailsImport,
            identifiantProjet: IdentifiantProjet.convertirEnValueType(
              event.payload.identifiantProjet,
            ),
            statut: Candidature.StatutCandidature.convertirEnValueType(event.payload.statut),
            technologie: Candidature.TypeTechnologie.convertirEnValueType(
              event.payload.technologie,
            ),
            dateÉchéanceGf: event.payload.dateÉchéanceGf
              ? DateTime.convertirEnValueType(event.payload.dateÉchéanceGf)
              : undefined,
            historiqueAbandon: Candidature.HistoriqueAbandon.convertirEnValueType(
              event.payload.historiqueAbandon,
            ),
            typeGarantiesFinancières: event.payload.typeGarantiesFinancières
              ? Candidature.TypeGarantiesFinancières.convertirEnValueType(
                  event.payload.typeGarantiesFinancières,
                )
              : undefined,
            actionnariat: event.payload.actionnariat
              ? Candidature.TypeActionnariat.convertirEnValueType(event.payload.actionnariat)
              : undefined,
          };

          const certificate = await buildCertificate({
            appelOffre: appelOffres,
            période,
            utilisateur,
            candidature: candidatureCorrigée,
            notifiéLe: candidature.notification.notifiéeLe.formatter(),
          });

          if (!certificate) {
            logger.warn(`Impossible de régénérer l'attestation du projet ${identifiantProjet}`);
            return;
          }

          await mediator.send<CorrigerDocumentProjetCommand>({
            type: 'Document.Command.CorrigerDocumentProjet',
            data: {
              content: certificate,
              documentProjetKey: candidature.notification.attestation.formatter(),
            },
          });
        }
        break;
    }
  };
  mediator.register('System.Candidature.Attestation.Saga.Execute', handler);
};
