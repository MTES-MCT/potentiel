import { Command } from '@oclif/core';
import { mediator } from 'mediateur';

import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import {
  countProjection,
  findProjection,
  listHistoryProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projection-read';
import { getProjetUtilisateurScopeAdapter } from '@potentiel-infrastructure/domain-adapters';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { Option } from '@potentiel-libraries/monads';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';

export class AjouterDemandeGFManquante extends Command {
  static description = `Ajouter les évènements 'GarantiesFinancièresDemandées-V1' pour les projets qui n'en ont pas et qui devraient`;

  async init() {
    AppelOffre.registerAppelOffreQueries({
      find: findProjection,
      list: listProjection,
    });

    Lauréat.registerLauréatQueries({
      count: countProjection,
      find: findProjection,
      list: listProjection,
      getScopeProjetUtilisateur: getProjetUtilisateurScopeAdapter,
      listHistory: listHistoryProjection,
    });
  }

  async run() {
    const logger = getLogger(AjouterDemandeGFManquante.name);

    const appelOffres = await mediator.send<AppelOffre.ListerAppelOffreQuery>({
      type: 'AppelOffre.Query.ListerAppelOffre',
      data: {},
    });

    if (appelOffres.items.length === 0) {
      logger.info("Aucun appel d'offre trouvé, aucun projet à traiter");
      return;
    }

    const appelOffreNonSoumisAuxGfs = appelOffres.items.reduce((acc, appelOffre) => {
      if (appelOffre.garantiesFinancières.soumisAuxGarantiesFinancieres === 'non soumis') {
        acc.push(`${appelOffre.id}#%`);
        return acc;
      }

      for (const période of appelOffre.periodes) {
        if (!période.familles.length) {
          continue;
        }

        for (const famille of période.familles) {
          if (famille.garantiesFinancières.soumisAuxGarantiesFinancieres === 'non soumis') {
            acc.push(`${appelOffre.id}#${période.id}#${famille.id}#%`);
            continue;
          }
        }
      }

      return acc;
    }, [] as string[]);

    if (appelOffreNonSoumisAuxGfs.length === 0) {
      logger.info(
        'Tous les appels d’offre sont soumis aux garanties financières, aucun projet à traiter',
      );
      return;
    }

    const projetsSansGFDemandée = await executeSelect<{
      identifiantProjet: IdentifiantProjet.RawType;
    }>(
      `
      select
        es.payload->>'identifiantProjet' as "identifiantProjet"
      from event_store.event_stream es
      where es.stream_id like 'lauréat|%'
        and NOT (es.payload->>'identifiantProjet' ilike any ($1))
        and not exists (
          select 1
          from event_store.event_stream es2
          where es2.stream_id =
            format('garanties-financieres|%s',
                  es.payload->>'identifiantProjet')
        )
        group by es.payload->>'identifiantProjet'
      `,
      appelOffreNonSoumisAuxGfs,
    );

    if (!projetsSansGFDemandée.length) {
      logger.info('Aucun projet trouvé sans demande de garanties financières');
      return;
    }

    logger.info(
      `ℹ️  Projets sans demande de garanties financières : ${projetsSansGFDemandée.length}`,
    );

    let success = 0;
    let errors = 0;

    for (const { identifiantProjet } of projetsSansGFDemandée) {
      try {
        const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
          type: 'Lauréat.Query.ConsulterLauréat',
          data: {
            identifiantProjet,
          },
        });

        if (Option.isNone(lauréat)) {
          logger.warn(
            `Le projet ${identifiantProjet} n'a pas été trouvé, impossible d'ajouter une demande de garanties financières`,
          );
          continue;
        }

        const event: Lauréat.GarantiesFinancières.GarantiesFinancièresDemandéesEvent = {
          type: 'GarantiesFinancièresDemandées-V1',
          payload: {
            identifiantProjet,
            demandéLe: lauréat.notifiéLe.formatter(),
            motif: 'motif-inconnu',
            dateLimiteSoumission: lauréat.notifiéLe.ajouterNombreDeMois(2).formatter(),
          },
        };

        await publish(`garanties-financieres|${identifiantProjet}`, event);

        logger.info(`Demande de garanties financières ajoutée pour le projet ${identifiantProjet}`);
        success += 1;
      } catch (error) {
        logger.error(
          `Erreur lors de l'ajout de la demande de garanties financières pour le projet ${identifiantProjet} : ${error}`,
        );
        errors += 1;
      }
    }

    logger.info(
      `✅  Terminé : ${success} demandes de garanties financières ajoutées, ${errors} erreurs`,
    );
  }
}
