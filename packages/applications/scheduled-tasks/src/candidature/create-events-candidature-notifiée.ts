import { mediator } from 'mediateur';

import { Éliminé } from '@potentiel-domain/elimine';
import { Candidature } from '@potentiel-domain/candidature';
import { listProjection } from '@potentiel-infrastructure/pg-projections';
import { Lauréat } from '@potentiel-domain/laureat';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Email, IdentifiantProjet } from '@potentiel-domain/common';
import { ConsulterUtilisateurQuery } from '@potentiel-domain/utilisateur';

Candidature.registerCandidaturesUseCases({ loadAggregate });

type Validateur = {
  fonction: string;
  nomComplet: string;
};

const validateurInconnu = {
  fonction: 'fonction inconnue',
  nomComplet: 'nom inconnu',
};

let compteurValidateurInconnu = 0;

const findValidateur = async (
  notifiéPar: Email.RawType,
  identifiantProjet: IdentifiantProjet.RawType,
): Promise<Validateur> => {
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

  const { appelOffre: identifiantAppelOffre, période: identifiantPériode } =
    IdentifiantProjet.convertirEnValueType(identifiantProjet);

  const appelOffres = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
    type: 'AppelOffre.Query.ConsulterAppelOffre',
    data: { identifiantAppelOffre },
  });

  if (Option.isNone(appelOffres)) {
    console.warn(`Appel d'offre non trouvé`, {
      identifiantProjet,
    });
    compteurValidateurInconnu++;
    return validateurInconnu;
  }

  const période = appelOffres.periodes.find((x) => x.id === identifiantPériode);

  if (!période) {
    console.warn(`Période non trouvée`, {
      identifiantProjet,
    });
    compteurValidateurInconnu++;
    return validateurInconnu;
  }

  if (!période.type || période.type == 'notified') {
    return {
      fonction: période.validateurParDéfaut.fonction,
      nomComplet: période.validateurParDéfaut.fullName,
    };
  }

  console.warn(`La période est une période legacy`, {
    identifiantProjet,
  });

  compteurValidateurInconnu++;
  return validateurInconnu;
};

(async () => {
  console.log('✨ Migration Candidature Notifiée');

  const lauréats = await listProjection<Lauréat.LauréatEntity>('lauréat');
  const éliminés = await listProjection<Éliminé.ÉliminéEntity>('éliminé');
  const all = [...lauréats.items, ...éliminés.items];

  console.log(`ℹ️ ${all.length} éléments trouvés`);

  for (const { identifiantProjet, attestation, notifiéLe, notifiéPar } of all) {
    console.log(`Looking for the Validateur of ${identifiantProjet}`);

    const validateurValue = await findValidateur(notifiéPar, identifiantProjet);

    console.log(`Publish NotifierCandidature pour ${identifiantProjet}`);

    await mediator.publish<Candidature.NotifierCandidatureUseCase>({
      type: 'Candidature.UseCase.NotifierCandidature',
      data: {
        identifiantProjetValue: identifiantProjet,
        attestationValue: { format: attestation.format },
        notifiéeLeValue: notifiéLe,
        notifiéeParValue: notifiéPar,
        validateurValue,
      },
    });
  }

  console.log(`🚀 Exécution terminée`);
  console.log(`👽 Nombre de validateurs inconnus : ${compteurValidateurInconnu}`);

  process.exit(0);
})();
