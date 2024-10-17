import { mediator } from 'mediateur';

import { Éliminé } from '@potentiel-domain/elimine';
import { Candidature } from '@potentiel-domain/candidature';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projections';
import { Lauréat } from '@potentiel-domain/laureat';
import { loadAggregate, publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

Candidature.registerCandidaturesUseCases({ loadAggregate });

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
let projetsLegacyAvecAttestation = 0;
let projetsLegacySansAttestation = 0;
let anomalies = 0;

const findValidateur = async (
  identifiantProjet: IdentifiantProjet.RawType,
): Promise<AppelOffre.Validateur | undefined> => {
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
    throw new Error('AO non trouvé');
  }

  const période = appelOffres.periodes.find((x) => x.id === identifiantPériode);

  if (!période) {
    console.warn(`❌ Période non trouvée`, {
      identifiantProjet,
    });
    anomalies++, compteurValidateurInconnu++;
    throw new Error('Période non trouvé');
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
  return undefined;
};

const getAttestationLegacyProjets = async () => {
  return await executeSelect<{ identifiantProjet: string; attestation: boolean }>(`
  SELECT 
    format('%s#%s#%s#%s', pr."appelOffreId",pr."periodeId",pr."familleId",pr."numeroCRE") AS "identifiantProjet",
    CASE WHEN f.id IS NULL THEN false ELSE true END as "attestation"
  FROM domain_views.projection ao
  CROSS JOIN LATERAL jsonb_array_elements(ao.value->'periodes') p
  INNER JOIN projects pr ON pr."appelOffreId"= ao.value->>'id' AND pr."periodeId"=p->>'id'
  LEFT JOIN files f ON f.id=pr."certificateFileId" AND f."forProject"=pr.id
  WHERE ao.key LIKE 'appel-offre|%' AND  p->>'type'='legacy';
`);
};

(async () => {
  console.log('✨ Migration Candidature Notifiée');

  const lauréats = await listProjection<Lauréat.LauréatEntity>('lauréat');
  const éliminés = await listProjection<Éliminé.ÉliminéEntity>('éliminé');
  const attestationsLegacyProjets = await getAttestationLegacyProjets();

  const all = [...lauréats.items, ...éliminés.items];

  console.log(`ℹ️ ${all.length} éléments trouvés`);

  for (const { identifiantProjet, notifiéLe, notifiéPar } of all) {
    console.log(`Looking for the Validateur of ${identifiantProjet}`);

    const validateurValue = await findValidateur(identifiantProjet);
    // handle période legacy
    if (!validateurValue) {
      const projet = attestationsLegacyProjets.find(
        (projet) => projet.identifiantProjet === identifiantProjet,
      );
      if (projet?.attestation) {
        console.log(
          `Publish NotifierCandidature période legacy avec attestation pour ${identifiantProjet}`,
        );

        await mediator.publish<Candidature.NotifierCandidatureUseCase>({
          type: 'Candidature.UseCase.NotifierCandidature',
          data: {
            identifiantProjetValue: identifiantProjet,
            attestationValue: { format: 'application/pdf' },
            notifiéeLeValue: notifiéLe,
            notifiéeParValue: notifiéPar,
            validateurValue: validateurInconnu,
          },
        });
        projetsLegacyAvecAttestation++;
      } else {
        console.log(
          `Publish NotifierCandidature période legacy sans attestation pour ${identifiantProjet}`,
        );

        // gérer le cas legacy où l'attestation n'existe pas.
        const event: Candidature.CandidatureNotifiéeEventV1 = {
          type: 'CandidatureNotifiée-V1',
          payload: {
            identifiantProjet,
            notifiéeLe: notifiéLe,
            notifiéePar: notifiéPar,
            validateur: validateurInconnu,
          },
        };
        await publish(`candidature|${identifiantProjet}`, event);
        projetsLegacySansAttestation++;
      }
    } else {
      console.log(`Publish NotifierCandidature pour ${identifiantProjet}`);

      await mediator.publish<Candidature.NotifierCandidatureUseCase>({
        type: 'Candidature.UseCase.NotifierCandidature',
        data: {
          identifiantProjetValue: identifiantProjet,
          attestationValue: { format: 'application/pdf' },
          notifiéeLeValue: notifiéLe,
          notifiéeParValue: notifiéPar,
          validateurValue,
        },
      });
    }
  }

  console.log(`🚀 Exécution terminée pour ${all.length} lauréats et éliminés`);
  console.log(`🤓 Nombre de validateurs par défault: ${compteurValidateurParDéfault}`);
  console.log(`👻 Nombre de validateurs inconnus: ${compteurValidateurInconnu}`);
  console.log(`🎯 Nombre de projets legacy avec attestation: ${projetsLegacyAvecAttestation}`);
  console.log(`😲 Nombre de projets legacy sans attestation: ${projetsLegacySansAttestation}`);
  console.log(`❌ Nombre d'anomalies: ${anomalies}`);

  process.exit(0);
})();
