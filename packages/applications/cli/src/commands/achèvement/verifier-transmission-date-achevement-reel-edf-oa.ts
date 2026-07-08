import { Command } from '@oclif/core';
import z from 'zod';

import type { IdentifiantProjet } from '@potentiel-domain/projet';

import { dbSchema } from '#helpers';

const envSchema = z.object({
  ...dbSchema.shape,
});

type Stats = {
  total: number;
  succès: Array<IdentifiantProjet.RawType>;
  erreurs: Array<{
    identifiantProjet: IdentifiantProjet.RawType;
    raison: string;
  }>;
};

export class VérifierTransmissionDateAchèvementRéelEDFOACommand extends Command {
  static override description =
    `Vérification des données envoyées pour l'historique de transmission des dates d'achèvement réel par EDF OA.
    Ici on va juste lire un fichier csv et valider les dates.`;

  async init() {
    envSchema.parse(process.env);
  }

  async run() {
    const stats: Stats = {
      total: 0,
      succès: [],
      erreurs: [],
    };

    /***
     * TODO :
     * 1. Lire fichier (non gitté)
     * 2. Pour chaque ligne il faut consulter achèvement et valider :
     * - On en attend 1 ? La date fournie est-elle cohérente ?
     * - On en a déjà 1 ? Date correspond ?
     * - Cf les règles de l'aggrégat pour tracker tout les throw métier
     */
  }
}
