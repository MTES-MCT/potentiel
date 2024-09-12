import { Candidature } from '@potentiel-domain/candidature';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

(async () => {
  const eventsToFix = await executeSelect<{
    stream_id: string;
    payload: Candidature.CandidatureImportéeEvent['payload'];
  }>(`
    select es."stream_id", es."payload"
    from event_store.event_stream es
    where type = 'CandidatureImportée-V1' 
    and (payload->>'appelOffre' is null or payload->>'période' is null);
  `);

  console.info(`${eventsToFix.length} candidatures to fix...`);

  for (const candidature of eventsToFix) {
    try {
      const { stream_id, payload } = candidature;

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);

      const candidatureCorrigéeEvent: Candidature.CandidatureCorrigéeEvent = {
        type: 'CandidatureCorrigée-V1',
        payload: {
          ...payload,
          appelOffre: identifiantProjet.appelOffre,
          période: identifiantProjet.période,
          corrigéLe: DateTime.now().formatter(),
          corrigéPar: 'team@potentiel.beta.gouv.fr',
        },
      };

      await publish(stream_id, candidatureCorrigéeEvent);
    } catch (error) {
      console.error(error);
    }
  }

  process.exit(0);
})();
