import { randomUUID } from 'crypto';
import { afterAll, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import waitForExpect from 'wait-for-expect';
import { executeQuery, killPool } from '@potentiel/pg-helpers';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { convertirEnIdentifiantProjet } from '@potentiel/domain-usecases';
import { UnsetupApp, bootstrap } from '../../../bootstrap';
import { sendEmail } from '@potentiel/email-sender';
import { Abandon } from '@potentiel-domain/laureat';
import { DateTime } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

let unsetupNotification: UnsetupApp;

jest.mock('@potentiel/email-sender');

describe(`Notification`, () => {
  beforeAll(async () => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  beforeEach(async () => {
    await executeQuery(`delete from event_store.event_stream`);
    await executeQuery(`delete from event_store.subscriber`);
    await executeQuery(`delete from domain_views.projection`);
    await executeQuery(`delete from "projects"`);
    await executeQuery(`delete from "UserProjects"`);
    await executeQuery(`delete from "users"`);
  });

  afterAll(async () => {
    if (unsetupNotification) {
      await unsetupNotification();
    }

    await executeQuery(`delete from event_store.event_stream`);
    await executeQuery(`delete from event_store.subscriber`);
    await executeQuery(`delete from domain_views.projection`);
    await executeQuery(`delete from "projects"`);
    await executeQuery(`delete from "UserProjects"`);
    await executeQuery(`delete from "users"`);

    await killPool();
  });

  describe(`Accorder un abandon pour un projet`, () => {
    test(`
        Étant donné le projet :
            | Nom    | Du boulodrome de Marseille |
            | Statut | Classé                     |
            | Région | Nouvelle-Aquitaine         |
        Et les porteurs suivant ayant accès au projet "Du boulodrome de Marseille"
            | Nom       | Email                         |
            | Porteur 1 | porteur1@boulodrome.marseille |
            | Porteur 2 | porteur2@boulodrome.marseille |
        Quand un abandon est accordé avec recandidature pour le projet lauréat "Du boulodrome de Marseille"
        Alors les porteurs suivants devraient être notifiés qu'ils doivent recandidater suite à l'abandon du projet "Du boulodrome de Marseille" :
            | Nom       | Email                         |
            | Porteur 1 | porteur1@boulodrome.marseille |
            | Porteur 2 | porteur2@boulodrome.marseille |
    `, async () => {
      // ARRANGE
      const nomProjet = 'Du boulodrome de Marseille';
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
        'Nouvelle-Aquitaine',
        'Classé',
        false,
        false,
        false,
      );

      const admin = {
        id: randomUUID(),
        nom: 'Admin',
        email: 'admin@potentiel.fr',
      };

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
        admin.id,
        admin.nom,
        admin.email,
        'admin',
      );

      const porteurs = [
        {
          id: randomUUID(),
          nom: 'Porteur 1',
          email: 'porteur1@boulodrome.marseille',
        },
        {
          id: randomUUID(),
          nom: 'Porteur 2',
          email: 'porteur2@boulodrome.marseille',
        },
      ];

      for (const { id, nom, email } of porteurs) {
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
        famille: '',
        numéroCRE: '27',
      });

      const aggregateId: `${string}|${string}` = `abandon|${identifiantProjet}`;
      const event1: Abandon.AbandonEvent = {
        type: 'AbandonDemandé-V1',
        payload: {
          identifiantProjet: identifiantProjet.formatter(),
          raison: 'Une raison',
          recandidature: true,
          demandéLe: DateTime.convertirEnValueType(new Date()).formatter(),
          demandéPar: IdentifiantUtilisateur.convertirEnValueType(admin.email).formatter(),
        },
      };
      await publish(aggregateId, event1);

      await sleep(200);

      const event2: Abandon.AbandonEvent = {
        type: 'AbandonAccordé-V1',
        payload: {
          identifiantProjet: identifiantProjet.formatter(),
          réponseSignée: {
            format: 'application/pdf',
          },
          accordéLe: DateTime.convertirEnValueType(new Date()).formatter(),
          accordéPar: IdentifiantUtilisateur.convertirEnValueType(admin.email).formatter(),
        },
      };
      await publish(aggregateId, event2);

      // ASSERT
      await waitForExpect(() => {
        expect(sendEmail).toHaveBeenCalledWith(
          expect.objectContaining({
            templateId: '5308275',
            messageSubject: `Transmettre une preuve de recandidature suite à l'abandon du projet ${nomProjet}`,
            recipients: expect.arrayContaining([
              { fullName: porteurs[0].nom, email: porteurs[0].email },
              { fullName: porteurs[1].nom, email: porteurs[1].email },
            ]),
            variables: expect.objectContaining({
              lien_transmettre_preuve_recandidature: `/laureat/${encodeURIComponent(
                identifiantProjet.formatter(),
              )}/abandon/preuve-recandidature`,
            }),
          }),
        );
      });
    });
  });
});

export const sleep = async (ms: number) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};
