import { Args, Command } from '@oclif/core';
import z from 'zod';
import { mediator } from 'mediateur';

import {
  registerDocumentProjetCommand,
  registerDocumentProjetQueries,
} from '@potentiel-domain/document';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DocumentAdapter } from '@potentiel-infrastructure/domain-adapters';
import { getLogger } from '@potentiel-libraries/monitoring';
import { DateTime, Email } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { parseCsvFile } from '../../helpers/parse-file';

const csvSchema = z.object({
  appelOffre: z.string(),
  periode: z.string(),
  famille: z.string(),
  numeroCRE: z.string(),
  referenceDossier: z.string().trim().optional(),
  dateAccuseReception: z
    .string()
    .trim()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, {
      message: "Le format de la date n'est pas respecté (format attendu : JJ/MM/AAAA)",
    })
    .or(z.literal(''))
    .optional(),
});

const convertDateToDateTime = (date: string) => {
  const [day, month, year] = date.split('/');
  return DateTime.convertirEnValueType(new Date(`${year}-${month}-${day}`));
};

const identifiantEnedis =
  GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType('17X100A100A0001A');

export default class TransmettreRéférences extends Command {
  async init() {
    registerDocumentProjetCommand({
      enregistrerDocumentProjet: DocumentAdapter.téléverserDocumentProjet,
      déplacerDossierProjet: DocumentAdapter.déplacerDossierProjet,
      archiverDocumentProjet: DocumentAdapter.archiverDocumentProjet,
    });
    registerDocumentProjetQueries({
      récupérerDocumentProjet: DocumentAdapter.téléchargerDocumentProjet,
    });
  }

  static args = {
    csvPath: Args.file({ required: true, description: 'Chemin du fichier CSV à importer' }),
  };

  async run() {
    const { args } = await this.parse(TransmettreRéférences);
    const logger = getLogger(TransmettreRéférences.name);

    logger.info('🏁 Début de la transmissions des dossiers de raccordement');

    const { parsedData } = await parseCsvFile(args.csvPath, csvSchema, {
      delimiter: ',',
      encoding: 'utf8',
    });

    const errors: {
      identifiantProjet?: string;
      index: number;
      error: unknown;
    }[] = [];
    let success = 0;

    for (let index = 0; index < parsedData.length; index++) {
      const rawLine = parsedData[index];

      let identifiantProjet: IdentifiantProjet.ValueType | undefined;
      try {
        const { appelOffre, numeroCRE, periode, famille, referenceDossier, dateAccuseReception } =
          csvSchema.parse(rawLine);
        if (!referenceDossier) {
          throw new Error('referenceDossier is missing');
        }
        if (!dateAccuseReception) {
          throw new Error('dateAccuseReception is missing');
        }
        identifiantProjet = IdentifiantProjet.convertirEnValueType(
          `${appelOffre}#${periode}#${famille}#${numeroCRE}`,
        );
        await handleLine({
          identifiantProjet,
          référenceDossier:
            Lauréat.Raccordement.RéférenceDossierRaccordement.convertirEnValueType(
              referenceDossier,
            ),
          dateAccuseRéception: convertDateToDateTime(dateAccuseReception),
        });
        success++;
      } catch (error) {
        const formattedError =
          error instanceof z.ZodError
            ? `${error.issues[0].path}: ${error.issues[0].message}`
            : error instanceof Error
              ? error.message
              : error;

        errors.push({
          identifiantProjet: identifiantProjet?.formatter(),
          index,
          error: formattedError,
        });
      }
    }

    console.log({
      success,
      errors: errors.length,
    });
    console.log(JSON.stringify(errors, null, 2));
  }
}

const handleLine = async ({
  identifiantProjet,
  référenceDossier,
  dateAccuseRéception,
}: {
  identifiantProjet: IdentifiantProjet.ValueType;
  référenceDossier: Lauréat.Raccordement.RéférenceDossierRaccordement.ValueType;
  dateAccuseRéception: DateTime.ValueType;
}) => {
  const raccordement = await mediator.send<Lauréat.Raccordement.ConsulterRaccordementQuery>({
    type: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
    data: {
      identifiantProjetValue: identifiantProjet.formatter(),
    },
  });

  if (Option.isNone(raccordement)) {
    throw new Error('Raccordement non trouvé');
  }

  if (!raccordement.identifiantGestionnaireRéseau?.estÉgaleÀ(identifiantEnedis)) {
    throw new Error('Raccordement non Enedis');
  }

  if (raccordement.dossiers.length > 0) {
    throw new Error('Multiples dossier');
  }

  await mediator.send<Lauréat.Raccordement.TransmettreDemandeComplèteRaccordementUseCase>({
    type: 'Lauréat.Raccordement.UseCase.TransmettreDemandeComplèteRaccordement',
    data: {
      identifiantProjetValue: identifiantProjet.formatter(),
      référenceDossierValue: référenceDossier.formatter(),
      dateQualificationValue: dateAccuseRéception.formatter(),
      transmiseParValue: Email.system().formatter(),
    },
  });
};
