import { randomUUID } from 'crypto';
import { afterAll, beforeAll, beforeEach, describe, jest, test } from '@jest/globals';
import { executeQuery, killPool } from '@potentiel/pg-helpers';
import { publish } from '@potentiel/pg-event-sourcing';
import { DépôtGarantiesFinancièresValidéEventV1 } from '@potentiel/domain/src/garantiesFinancières/dépôt/dépôtGarantiesFinancières.event';
import {
  convertirEnIdentifiantProjet,
  createGarantiesFinancièresAggregateId,
} from '@potentiel/domain';
import { UnsetupApp, bootstrap } from '../../bootstrap';

let unsetupNotification: UnsetupApp;

jest.mock('../../sendEmail');

describe(`Notification sur les dépôts des garanties financières`, () => {
  beforeAll(async () => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  beforeEach(async () => {
    await executeQuery(`delete from event_store.event_stream`);
    await executeQuery(`delete from event_store.subscriber`);
    await executeQuery(`delete from domain_views.projection`);
  });

  afterAll(async () => {
    if (unsetupNotification) {
      await unsetupNotification();
    }

    await executeQuery(`delete from event_store.event_stream`);
    await executeQuery(`delete from event_store.subscriber`);
    await executeQuery(`delete from domain_views.projection`);

    await killPool();
  });

  describe(`Notifier qu'un dépôt a été validé`, () => {
    test(`
        Étant donné le projet :
            | Nom    | Du boulodrome de Marseille |
            | Statut | Classé                     |
            | Région | Nouvelle-Aquitaine         |
        Et les porteurs suivant ayant accès au projet "Du boulodrome de Marseille"
            | Nom       | Email                         |
            | Porteur 1 | porteur1@boulodrome.marseille |
            | Porteur 2 | porteur2@boulodrome.marseille |
        Quand un dépôt de garanties financières est validé pour le projet "Du boulodrome de Marseille"
        Alors les porteurs suivants devraient être notifiés que le dépôt de garanties financières pour le projet "Du boulodrome de Marseille" a été validé :
            | Nom       | Email                         |
            | Porteur 1 | porteur1@boulodrome.marseille |
            | Porteur 2 | porteur2@boulodrome.marseille |
    `, async () => {
      // ARRANGE
      const nomProjet = 'Du boulodrome de Marseille';
      const statutProjet = 'Classé';
      const régionProjet = 'Nouvelle-Aquitaine';

      const projectLegacyId = randomUUID();
      await executeQuery(
        `
        insert into "projects" (
          "id",
          "appelOffreId",
          "periodeId",
          "numeroCRE",
          "familleId",
          "nomCandidat",
          "nomProjet",
          "puissance",
          "prixReference",
          "evaluationCarbone",
          "note",
          "nomRepresentantLegal",
          "email",
          "codePostalProjet",
          "communeProjet",
          "departementProjet",
          "regionProjet",
          "classe",
          "isFinancementParticipatif",
          "isInvestissementParticipatif",
          "engagementFournitureDePuissanceAlaPointe"
        )
        values (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          $12,
          $13,
          $14,
          $15,
          $16,
          $17,
          $18,
          $19,
          $20,
          $21
        )
      `,
        projectLegacyId,
        'PPE2 - Eolien',
        '1',
        '27',
        '',
        'nomCandidat',
        nomProjet,
        0,
        0,
        0,
        0,
        'nomRepresentantLegal',
        'email',
        'codePostalProjet',
        'communeProjet',
        'departementProjet',
        régionProjet,
        statutProjet,
        false,
        false,
        false,
      );

      const idPorteur1 = randomUUID();
      const nomPorteur1 = 'Porteur 1';
      const emailPorteur1 = 'porteur1@boulodrome.marseille';

      const idPorteur2 = randomUUID();
      const nomPorteur2 = 'Porteur 2';
      const emailPorteur2 = 'porteur2@boulodrome.marseille';

      for (const { id, nom, email } of [
        { id: idPorteur1, nom: nomPorteur1, email: emailPorteur1 },
        { id: idPorteur2, nom: nomPorteur2, email: emailPorteur2 },
      ]) {
        await executeQuery(
          `
            insert into "users" (
              "id",
              "fullName",
              "email",
              "role"
            )
            values (
              $1,
              $2,
              $3,
              $4
            )`,
          id,
          nom,
          email,
          'porteur-projet',
        );

        await executeQuery(
          `
            insert into "UserProjects" (
              "userId",
              "projectId"
            )
            values (
              $1,
              $2
            )
          `,
          id,
          projectLegacyId,
        );
      }

      unsetupNotification = await bootstrap();

      // ACT
      const identifiantProjet = convertirEnIdentifiantProjet({
        appelOffre: 'PPE2 - Eolien',
        période: '1',
        famille: '27',
        numéroCRE: '',
      });

      const event: DépôtGarantiesFinancièresValidéEventV1 = {
        type: 'DépôtGarantiesFinancièresValidé-v1',
        payload: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      };

      await publish(createGarantiesFinancièresAggregateId(identifiantProjet), event);

      // ASSERT
    });
  });
});
