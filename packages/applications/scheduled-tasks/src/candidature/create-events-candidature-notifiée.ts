import { mediator } from 'mediateur';

import { Éliminé } from '@potentiel-domain/elimine';
import { Candidature } from '@potentiel-domain/candidature';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projections';
import { Lauréat } from '@potentiel-domain/laureat';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Email, IdentifiantProjet } from '@potentiel-domain/common';
import {
  ConsulterUtilisateurQuery,
  registerUtilisateurQueries,
} from '@potentiel-domain/utilisateur';
import {
  listerUtilisateursAdapter,
  récupérerUtilisateurAdapter,
  vérifierAccèsProjetAdapter,
} from '@potentiel-infrastructure/domain-adapters';

Candidature.registerCandidaturesUseCases({ loadAggregate });

registerUtilisateurQueries({
  récupérerUtilisateur: récupérerUtilisateurAdapter,
  vérifierAccèsProjet: vérifierAccèsProjetAdapter,
  listerUtilisateurs: listerUtilisateursAdapter,
});

AppelOffre.registerAppelOffreQueries({
  list: listProjection,
  find: findProjection,
});

const validateurInconnu = {
  fonction: 'fonction inconnue',
  nomComplet: 'nom inconnu',
};

let compteurValidateurInconnu = 0;
let compteurValidateurParDéfault = 0;
let compteurValidateurIdentifié = 0;
let anomalies = 0;

const findValidateur = async (
  notifiéPar: Email.RawType,
  identifiantProjet: IdentifiantProjet.RawType,
): Promise<AppelOffre.Validateur> => {
  const utilisateur = await mediator.send<ConsulterUtilisateurQuery>({
    type: 'Utilisateur.Query.ConsulterUtilisateur',
    data: {
      identifiantUtilisateur: notifiéPar,
    },
  });

  if (
    Option.isSome(utilisateur) &&
    utilisateur.email !== 'aopv.dgec@developpement-durable.gouv.fr'
  ) {
    console.log(`✅ Utilisateur identifié`, {
      identifiantProjet,
    });
    compteurValidateurIdentifié++;
    return {
      fonction: utilisateur.fonction,
      nomComplet: utilisateur.nomComplet,
    };
  }

  const { appelOffre: identifiantAppelOffre, période: identifiantPériode } =
    IdentifiantProjet.convertirEnValueType(identifiantProjet);

  const appelOffres = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
    type: 'AppelOffre.Query.ConsulterAppelOffre',
    data: { identifiantAppelOffre },
  });

  if (Option.isNone(appelOffres)) {
    console.warn(`❌ Appel d'offre non trouvé`, {
      identifiantProjet,
    });
    anomalies++, compteurValidateurInconnu++;
    return validateurInconnu;
  }

  const période = appelOffres.periodes.find((x) => x.id === identifiantPériode);

  if (!période) {
    console.warn(`❌ Période non trouvée`, {
      identifiantProjet,
    });
    anomalies++, compteurValidateurInconnu++;
    return validateurInconnu;
  }

  if (!période.type || période.type == 'notified') {
    console.log(`🤓 Validateur par défaut identifié`, {
      identifiantProjet,
    });
    compteurValidateurParDéfault++;
    return {
      fonction: période.validateurParDéfaut.fonction,
      nomComplet: période.validateurParDéfaut.nomComplet,
    };
  }

  console.warn(`❓ La période est une période legacy, un validateur inconnu sera ajouté`, {
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

  for (const { identifiantProjet, notifiéLe, notifiéPar } of all) {
    console.log(`Looking for the Validateur of ${identifiantProjet}`);

    const validateurValue = await findValidateur(notifiéPar, identifiantProjet);

    console.log(`Publish NotifierCandidature pour ${identifiantProjet}`);

    const format = 'application/pdf';

    await mediator.publish<Candidature.NotifierCandidatureUseCase>({
      type: 'Candidature.UseCase.NotifierCandidature',
      data: {
        identifiantProjetValue: identifiantProjet,
        attestationValue: { format },
        notifiéeLeValue: notifiéLe,
        notifiéeParValue: notifiéPar,
        validateurValue,
      },
    });
  }

  console.log(`🚀 Exécution terminée pour ${all.length} lauréats et éliminés`);
  console.log(`✅ Nombre de validateurs identifié: ${compteurValidateurIdentifié}`);
  console.log(`🤓 Nombre de validateurs par défault: ${compteurValidateurParDéfault}`);
  console.log(`👻 Nombre de validateurs inconnus: ${compteurValidateurInconnu}`);
  console.log(`❌ Nombre d'anomalies: ${anomalies}`);

  process.exit(0);
})();
