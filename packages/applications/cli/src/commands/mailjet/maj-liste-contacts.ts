import { Command, Flags } from '@oclif/core';
import z from 'zod';

import { Where } from '@potentiel-domain/entity';
import { Role, type UtilisateurEntity } from '@potentiel-domain/utilisateur';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { getLogger } from '@potentiel-libraries/monitoring';

import { dbSchema, mailjetSchema } from '#helpers';
import { createMailjetClient } from '../../helpers/mailjet/client.js';
import type { RôleSansVisiteur } from '../../helpers/mailjet/types.js';

const envSchema = z.object({
  ...dbSchema.shape,
  ...mailjetSchema.shape,
});

export class MiseÀJourListeContactsMailjetCommand extends Command {
  static description =
    `Compare le nombre de contacts d'une liste Mailjet avec le nombre d'utilisateurs Potentiel`;

  static flags = {
    listId: Flags.integer({
      char: 'l',
      description: 'identifiant numérique de la liste Mailjet (et non son adresse)',
      required: true,
    }),
    role: Flags.string({
      char: 'r',
      description: 'filtrage par rôle',
      options: Role.roles.filter((rôle) => rôle !== 'visiteur'),
      required: false,
    }),
  };

  async run() {
    const {
      flags: { listId, role },
    } = await this.parse(MiseÀJourListeContactsMailjetCommand);
    const { MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE } = envSchema.parse(process.env);

    const logger = getLogger();

    const { items: potentielUtilisateurs } = await listProjection<UtilisateurEntity>(
      `utilisateur`,
      {
        where: {
          identifiantUtilisateur: Where.notLike('%@clients'),
          désactivé: Where.equalNull(),
          rôle: Where.equal(role as RôleSansVisiteur),
        },
      },
    );

    if (!potentielUtilisateurs.length) {
      logger.error(`❌ Aucun utilisateur Potentiel trouvé`);
      return;
    }

    const mailjetClient = createMailjetClient({
      apiKeyPrivate: MJ_APIKEY_PRIVATE,
      apiKeyPublic: MJ_APIKEY_PUBLIC,
    });

    const contactsMailjet = await mailjetClient.contactList.lister({ listId });

    console.info(`📊 ${potentielUtilisateurs.length} utilisateurs dans Potentiel`);
    console.info(`📬 ${contactsMailjet.length} contacts dans la liste Mailjet ${listId}`);

    const emailsMailjet = new Set(contactsMailjet.map(({ Email }) => Email.toLowerCase()));

    const utilisateursÀAjouter = potentielUtilisateurs
      .filter(
        ({ identifiantUtilisateur }) => !emailsMailjet.has(identifiantUtilisateur.toLowerCase()),
      )
      .map(({ identifiantUtilisateur, rôle }) => ({
        email: identifiantUtilisateur.toLowerCase(),
        rôle,
      }));

    if (!utilisateursÀAjouter.length) {
      console.info(`✅ Aucun utilisateur à ajouter dans Mailjet`);
      return;
    }
    console.info(`📊 ${utilisateursÀAjouter.length} contacts à ajouter à Mailjet`);

    const jobId = await mailjetClient.contactList.ajouter({
      listId,
      contacts: utilisateursÀAjouter,
    });
    const job = await mailjetClient.job.attendreFin({ listId, jobId });

    if (job.Status !== 'Completed' || job.Error) {
      console.error(`❌ Job Mailjet en échec (${job.Status}) : ${job.Error}`);
      const erreurs = await mailjetClient.job.récupérerErreurs({ jobId });
      console.error(`📄 Détail des erreurs :`, JSON.stringify(erreurs));
      return;
    }

    console.info(
      `⚡️ ${job.Count} utilisateurs ajoutés à la liste ${listId} dans Mailjet (${utilisateursÀAjouter.length})`,
    );
  }
}
