'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import type { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime } from '@potentiel-domain/common';
import { InvalidOperationError } from '@potentiel-domain/core';
import type { Période } from '@potentiel-domain/periode';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { ImportCSV } from '@potentiel-libraries/csv';
import { Option } from '@potentiel-libraries/monads';

import { statutCsvSchema } from '@/utils/candidature/csv/candidatureCsvFields.schema';
import { instructionSchema } from '@/utils/candidature/instruction.schema';
import { type ActionResult, type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.object({
  appelOffre: zod.string(),
  periode: zod.string(),
  famille: zod.string().optional(),
  fichierInstruction: singleDocument({ acceptedFileTypes: ['text/csv'] }),
});

export type ImporterCandidaturesParDémarcheNumériqueFormKeys = keyof zod.infer<typeof schema>;

const instructionCsvSchema = zod.object({
  numeroDossierDN: zod.coerce.number(),
  statut: statutCsvSchema,
  note: instructionSchema.shape.noteTotale,
  motifElimination: instructionSchema.shape.motifÉlimination,
  volumeReserve: instructionSchema.shape.volumeRéservé,
});
const action: FormAction<FormState, typeof schema> = async (
  _,
  { appelOffre, periode, fichierInstruction },
) =>
  withUtilisateur(async (utilisateur) => {
    const { parsedData: instructions } = await ImportCSV.fromCSV(
      fichierInstruction.content,
      instructionCsvSchema,
      { delimiter: ';' },
    );

    if (instructions.length === 0) {
      return {
        status: 'validation-error',
        errors: { fichierInstruction: 'Le fichier est vide' },
      };
    }

    await vérifierInstructions({ appelOffres: appelOffre, période: periode, instructions });

    await mediator.send<Période.InitierImportPériodeUseCase>({
      type: 'Période.UseCase.InitierImportPériode',
      data: {
        identifiantPériodeValue: `${appelOffre}#${periode}`,
        initiéLeValue: DateTime.now().formatter(),
        initiéParValue: utilisateur.identifiantUtilisateur.formatter(),
        instructionValue: instructions.map(
          ({ numeroDossierDN, statut, motifElimination, note, volumeReserve }) => ({
            identifiantProjet: IdentifiantProjet.bind({
              appelOffre,
              période: String(periode),
              famille: '',
              numéroCRE: String(numeroDossierDN),
            }).formatter(),
            statut,
            motifÉlimination: motifElimination,
            noteTotale: note,
            volumeRéservé: volumeReserve,
          }),
        ),
      },
    });

    return {
      status: 'success',
      result: {
        successMessage: `L'import peut prendre quelques minutes, veuillez patienter avant de consulter la liste des candidatures`,
        link: {
          url: Routes.Candidature.lister({
            appelOffre,
            periode,
            notifie: 'a-notifier',
          }),
          label: 'Voir les candidatures importées',
        },
        errors: [],
      },
    };
  });

type VérifierInstructionsProps = {
  appelOffres: string;
  période: string;
  instructions: ReadonlyArray<{
    numeroDossierDN: number;
    statut: 'éliminé' | 'classé';
    note?: number | undefined;
    motifElimination?: string | undefined;
    volumeReserve?: boolean | undefined;
  }>;
};

const vérifierInstructions = async ({
  appelOffres,
  période,
  instructions,
}: VérifierInstructionsProps) => {
  const errors: ActionResult['errors'] = [];

  const détailAppelOffres = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
    type: 'AppelOffre.Query.ConsulterAppelOffre',
    data: { identifiantAppelOffre: appelOffres },
  });
  if (Option.isNone(détailAppelOffres)) {
    throw new InvalidOperationError(`L'appel d'offres ${appelOffres} est introuvable`);
  }

  const détailPériode = détailAppelOffres.periodes.find((p) => p.id === période);
  if (!détailPériode) {
    throw new InvalidOperationError(
      `La période ${période} de l'appel d'offres ${appelOffres} est introuvable`,
    );
  }

  const périodeAvecVolumeRéservé = !!détailPériode.volumeRéservé;

  for (const { numeroDossierDN, statut, motifElimination, volumeReserve } of instructions) {
    const key = `Dossier ${numeroDossierDN}`;

    if (périodeAvecVolumeRéservé && volumeReserve === undefined) {
      errors.push({
        key,
        reason: `Vous devez compléter la colonne "volumeReserve" par "oui" ou "non" pour tous les candidats de cette période`,
      });
      continue;
    }

    if (périodeAvecVolumeRéservé && statut === 'éliminé' && volumeReserve === true) {
      errors.push({
        key,
        reason: `Un projet éliminé ne peut pas se trouver dans un volume réservé`,
      });
      continue;
    }

    if (!périodeAvecVolumeRéservé && volumeReserve !== undefined) {
      errors.push({
        key,
        reason: `Cette période n'est pas concernée par un volume réservé, la colonne "volumeReserve" doit rester vide`,
      });
      continue;
    }

    if (statut === 'éliminé' && !motifElimination) {
      errors.push({
        key,
        reason: `le motif d'élimination est requis pour un projet éliminé`,
      });
    }

    if (errors.length) {
      return {
        status: 'success',
        result: {
          successMessage: ``,
          errors,
        },
      };
    }
  }
};

export const importerCandidaturesParDémarcheNumériqueAction = formAction(action, schema);
