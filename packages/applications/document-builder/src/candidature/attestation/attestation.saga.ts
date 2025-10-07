import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';

import { buildCertificate, BuildCertificateProps } from './buildCertificate';

export type SubscriptionEvent = (
  | Candidature.CandidatureNotifiéeEvent
  | Candidature.CandidatureCorrigéeEvent
) &
  Event;

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

    return match(event)
      .with(
        { type: 'CandidatureNotifiée-V3' },
        async ({
          payload: {
            attestation: { format },
            notifiéeLe: notifiéLe,
            validateur,
          },
        }) => {
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
        },
      )
      .with({ type: 'CandidatureCorrigée-V2' }, async ({ payload }) => {
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
        const candidatureCorrigée = mapCorrectionToCandidature(payload, appelOffre);

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
      })
      .exhaustive();
  };
  mediator.register('System.Candidature.Attestation.Saga.Execute', handler);
};

const mapCorrectionToCandidature = (
  payload: Candidature.CandidatureCorrigéeEvent['payload'],
  appelOffres: AppelOffre.AppelOffreReadModel,
): BuildCertificateProps['candidature'] => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(payload.identifiantProjet),
  dépôt: Candidature.Dépôt.convertirEnValueType(payload),
  instruction: Candidature.Instruction.convertirEnValueType(payload),
  unitéPuissance: Candidature.UnitéPuissance.déterminer({
    appelOffres,
    période: IdentifiantProjet.convertirEnValueType(payload.identifiantProjet).période,
    technologie: payload.technologie,
  }),
  technologie: Candidature.TypeTechnologie.déterminer({
    appelOffre: appelOffres,
    projet: { technologie: payload.technologie },
  }),
});
