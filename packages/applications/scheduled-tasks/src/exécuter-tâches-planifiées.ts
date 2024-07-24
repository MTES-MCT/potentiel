import { mediator } from 'mediateur';

import {
  ExécuterTâchePlanifiéeUseCase,
  ListerTâchesPlanifiéesQuery,
  TypeTâchePlanifiée,
} from '@potentiel-domain/tache-planifiee';
import { DateTime } from '@potentiel-domain/common';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { getLogger } from '@potentiel-libraries/monitoring';
import { InvalidOperationError } from '@potentiel-domain/core';
import { sendEmail } from '@potentiel-infrastructure/email';
import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import {
  récupérerDrealsParIdentifiantProjetAdapter,
  récupérerPorteursParIdentifiantProjetAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { Routes } from '@potentiel-applications/routes';

(async () => {
  const logger = getLogger();
  logger.info('Lancement du script...');
  const today = DateTime.now().formatterDate();

  const tâches = await mediator.send<ListerTâchesPlanifiéesQuery>({
    type: 'Tâche.Query.ListerTâchesPlanifiées',
    data: {
      àExécuterLe: today,
    },
  });

  logger.info(`Il y a ${tâches.items.length} tâches à exécuter le ${today}`);

  for (const tâche of tâches.items) {
    logger.info(
      `Exécution de ${tâche.typeTâchePlanifiée.type} pour ${tâche.identifiantProjet.formatter()}`,
    );

    try {
      const { identifiantProjet, typeTâchePlanifiée } = tâche;
      switch (typeTâchePlanifiée.type) {
        case 'garanties-financières.échoir':
          await mediator.send<GarantiesFinancières.ÉchoirGarantiesFinancièresUseCase>({
            type: 'Lauréat.GarantiesFinancières.UseCase.ÉchoirGarantiesFinancières',
            data: {
              identifiantProjetValue: identifiantProjet.formatter(),
              échuLeValue: DateTime.now().formatter(),
              dateÉchéanceValue: tâche.àExécuterLe.ajouterNombreDeJours(-1).formatter(),
            },
          });
          break;
        case 'garanties-financières.rappel-échéance-un-mois':
        case 'garanties-financières.rappel-échéance-deux-mois':
          const {
            nom,
            localité: { département },
          } = await mediator.send<ConsulterCandidatureQuery>({
            type: 'Candidature.Query.ConsulterCandidature',
            data: {
              identifiantProjet: identifiantProjet.formatter(),
            },
          });

          const porteurs = await récupérerPorteursParIdentifiantProjetAdapter(
            tâche.identifiantProjet,
          );
          const dreals = await récupérerDrealsParIdentifiantProjetAdapter(identifiantProjet);
          const nombreDeMois = tâche.typeTâchePlanifiée.estÉgaleÀ(
            TypeTâchePlanifiée.garantiesFinancieresRappelÉchéanceUnMois,
          )
            ? '1'
            : '2';

          const { BASE_URL } = process.env;

          await sendEmail({
            messageSubject: `Les garanties financières pour le projet ${nom} arrivent à échéance dans ${nombreDeMois} mois`,
            recipients: dreals,
            templateId: 6164034,
            variables: {
              nom_projet: nom,
              departement_projet: département,
              nombre_mois: nombreDeMois,
              url: `${BASE_URL}${Routes.GarantiesFinancières.détail(identifiantProjet.formatter())}`,
            },
          });

          await sendEmail({
            messageSubject: `Vos garanties financières pour le projet ${nom} arrivent à échéance dans ${nombreDeMois} mois`,
            recipients: porteurs,
            templateId: 6164049,
            variables: {
              nom_projet: nom,
              departement_projet: département,
              nombre_mois: nombreDeMois,
              url: `${BASE_URL}${Routes.GarantiesFinancières.détail(identifiantProjet.formatter())}`,
            },
          });

          break;
        default:
          throw new TypeNonGéréError();
      }

      await mediator.send<ExécuterTâchePlanifiéeUseCase>({
        type: 'System.TâchePlanifiée.UseCase.ExécuterTâchePlanifiée',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          typeTâchePlanifiéeValue: tâche.typeTâchePlanifiée.type,
        },
      });
    } catch (e) {
      logger.warn(`Error lors de l'execution de la tâche planifiée`, {
        typeTâchePlanifiée: tâche.typeTâchePlanifiée.type,
        identifiantProjet: tâche.identifiantProjet.formatter(),
        error: (e as Error).message,
      });
    }
  }
  logger.info('Fin du script ✨');
})();

class TypeNonGéréError extends InvalidOperationError {
  constructor() {
    super(`Le type de tâche planifiée n'est pas géré`);
  }
}
