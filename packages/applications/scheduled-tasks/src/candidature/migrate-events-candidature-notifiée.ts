import { mediator } from 'mediateur';

import { Éliminé } from '@potentiel-domain/elimine';
import { Candidature } from '@potentiel-domain/candidature';
import { listProjection } from '@potentiel-infrastructure/pg-projections';
import { Lauréat } from '@potentiel-domain/laureat';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';

Candidature.registerCandidaturesUseCases({ loadAggregate });

(async () => {
  console.log('✨ Migration Candidature Notifiée');
  const lauréats = await listProjection<Lauréat.LauréatEntity>('lauréat');
  const éliminés = await listProjection<Éliminé.ÉliminéEntity>('éliminé');
  const all = [...lauréats.items, ...éliminés.items];

  console.log(`ℹ️ ${all.length} éléments trouvés`);

  for (const { identifiantProjet, attestation, notifiéLe, notifiéPar } of all) {
    console.log(`Publish NotifierCandidature pour ${identifiantProjet}`);
    await mediator.publish<Candidature.NotifierCandidatureUseCase>({
      type: 'Candidature.UseCase.NotifierCandidature',
      data: {
        identifiantProjetValue: identifiantProjet,
        attestationValue: { format: attestation.format },
        notifiéLeValue: notifiéLe,
        notifiéParValue: notifiéPar,
      },
    });
  }

  console.log(`🚀 Exécution terminée`);

  process.exit(0);
})();
