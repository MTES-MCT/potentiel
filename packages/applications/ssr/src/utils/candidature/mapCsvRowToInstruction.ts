import { z } from 'zod';

import { Candidature } from '@potentiel-domain/projet';

import { candidatureCsvSchema } from './candidatureCsv.schema';

type CsvRow = z.infer<typeof candidatureCsvSchema>;

export const mapCsvRowToInstruction = (row: CsvRow): Candidature.Instruction.RawType => ({
  noteTotale: row.noteTotale,
  statut: row.statut,
  motifÉlimination: row.motifÉlimination,
});
