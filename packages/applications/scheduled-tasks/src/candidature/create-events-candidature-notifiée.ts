import { mediator } from 'mediateur';

import { Éliminé } from '@potentiel-domain/elimine';
import { Candidature } from '@potentiel-domain/candidature';
import { listProjection } from '@potentiel-infrastructure/pg-projections';
import { Lauréat } from '@potentiel-domain/laureat';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import { ConsulterUtilisateurQuery } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

Candidature.registerCandidaturesUseCases({ loadAggregate });

(async () => {
  console.log('✨ Migration Candidature Notifiée');

  const lauréats = await listProjection<Lauréat.LauréatEntity>('lauréat');
  const éliminés = await listProjection<Éliminé.ÉliminéEntity>('éliminé');
  const all = [...lauréats.items, ...éliminés.items];

  console.log(`ℹ️ ${all.length} éléments trouvés`);

  for (const { identifiantProjet, attestation, notifiéLe, notifiéPar } of all) {
    console.log(`Get détails on notifiéPar for ${identifiantProjet}`);
    const utilisateur = await mediator.send<ConsulterUtilisateurQuery>({
      type: 'Utilisateur.Query.ConsulterUtilisateur',
      data: {
        identifiantUtilisateur: notifiéPar,
      },
    });

    if (Option.isNone(utilisateur)) {
      console.warn(`Utilisateur non trouvé`, {
        identifiantProjet,
        identifiantUtilisateur: notifiéPar,
      });
    }

    console.log(`Publish NotifierCandidature pour ${identifiantProjet}`);
    await mediator.publish<Candidature.NotifierCandidatureUseCase>({
      type: 'Candidature.UseCase.NotifierCandidature',
      data: {
        identifiantProjetValue: identifiantProjet,
        attestationValue: { format: attestation.format },
        notifiéeLeValue: notifiéLe,
        notifiéeParValue: notifiéPar,
        validateurValue: {
          fonction: Option.isNone(utilisateur) ? 'fonction inconnue' : utilisateur.fonction,
          nomComplet: Option.isNone(utilisateur) ? 'validateur inconnu' : utilisateur.nomComplet,
        },
      },
    });
  }

  console.log(`🚀 Exécution terminée`);

  process.exit(0);
})();
