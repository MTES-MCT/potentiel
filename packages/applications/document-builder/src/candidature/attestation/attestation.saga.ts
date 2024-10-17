import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Candidature } from '@potentiel-domain/candidature';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { buildCertificate, BuildCertificateProps } from './buildCertificate';

export type SubscriptionEvent =
  | Candidature.CandidatureNotifiéeEvent
  | Candidature.CandidatureCorrigéeEvent;

export type Execute = Message<'System.Candidature.Attestation.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const logger = getLogger('System.Candidature.Attestation.Saga.Execute');

    const { payload, type } = event;
    const { identifiantProjet } = payload;

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

    const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: { identifiantAppelOffre: candidature.identifiantProjet.appelOffre },
    });

    if (Option.isNone(appelOffre)) {
      logger.warn(`Appel d'offres non trouvé`, { identifiantProjet });
      return;
    }

    const période = appelOffre.periodes.find(
      (période) => période.id === candidature.identifiantProjet.période,
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

    switch (type) {
      case 'CandidatureNotifiée-V2': {
        const {
          attestation: { format },
          notifiéeLe: notifiéLe,
          validateur,
        } = payload;

        const certificate = await buildCertificate({
          appelOffre,
          période,
          candidature,
          validateur,
          notifiéLe,
        });

        if (!certificate) {
          logger.warn(`Impossible de générer l'attestation du projet ${identifiantProjet}`);
          return;
        }

        const attestation = DocumentProjet.convertirEnValueType(
          identifiantProjet,
          'attestation',
          notifiéLe,
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

      case 'CandidatureCorrigée-V1': {
        // la correction d'une candidature ne peut pas modifier le champs notification ou validateur
        // on peut donc sans crainte utiliser ces 2 champs
        if (!candidature.notification?.notifiéeLe) {
          logger.info(`L'attestation ne sera pas régénérée car la candidature n'est pas notifiée`, {
            identifiantProjet,
          });
          return;
        }
        if (payload.doitRégénérerAttestation !== true) {
          logger.info(`L'attestation ne sera pas régénérée`, {
            identifiantProjet,
          });
          return;
        }
        if (!candidature.notification.attestation) {
          logger.info(
            `L'attestation ne sera pas régénérée car la candidature n'a pas d'attestation existante.`,
            { identifiantProjet },
          );
          return;
        }
        const candidatureCorrigée = mapCorrectionToCandidature(payload);

        const {
          notification: {
            notifiéeLe,
            validateur,
            attestation: { format },
          },
        } = candidature;

        const certificate = await buildCertificate({
          appelOffre,
          période,
          validateur,
          notifiéLe: notifiéeLe.formatter(),
          candidature: candidatureCorrigée,
        });

        if (!certificate) {
          logger.warn(`Impossible de régénérer l'attestation du projet ${identifiantProjet}`);
          return;
        }

        const attestation = DocumentProjet.convertirEnValueType(
          identifiantProjet,
          'attestation',
          payload.corrigéLe,
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
    }
  };
  mediator.register('System.Candidature.Attestation.Saga.Execute', handler);
};

const mapCorrectionToCandidature = (
  payload: Candidature.CandidatureCorrigéeEvent['payload'],
): BuildCertificateProps['candidature'] => ({
  emailContact: payload.emailContact,
  evaluationCarboneSimplifiée: payload.evaluationCarboneSimplifiée,
  localité: payload.localité,
  nomCandidat: payload.nomCandidat,
  nomProjet: payload.nomProjet,
  nomReprésentantLégal: payload.nomReprésentantLégal,
  noteTotale: payload.noteTotale,
  prixReference: payload.prixReference,
  puissanceALaPointe: payload.puissanceALaPointe,
  puissanceProductionAnnuelle: payload.puissanceProductionAnnuelle,
  motifÉlimination: payload.motifÉlimination,
  identifiantProjet: IdentifiantProjet.convertirEnValueType(payload.identifiantProjet),
  statut: Candidature.StatutCandidature.convertirEnValueType(payload.statut),
  technologie: Candidature.TypeTechnologie.convertirEnValueType(payload.technologie),
  actionnariat: payload.actionnariat
    ? Candidature.TypeActionnariat.convertirEnValueType(payload.actionnariat)
    : undefined,
});
