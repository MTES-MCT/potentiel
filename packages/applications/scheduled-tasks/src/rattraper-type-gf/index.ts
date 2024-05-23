import { readFile } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { mediator } from 'mediateur';

import {
  GarantiesFinancières,
  registerLauréatQueries,
  registerLauréatUseCases,
} from '@potentiel-domain/laureat';
import {
  getModèleRéponseAbandon,
  getModèleMiseEnDemeureGarantiesFinancières,
} from '@potentiel-infrastructure/document-builder';
import {
  consulterCahierDesChargesChoisiAdapter,
  listerAbandonsPourPorteurAdapter,
  listerAbandonsAdapter,
  récupérerRégionDrealAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import {
  findProjection,
  listProjection,
  listProjectionV2,
} from '@potentiel-infrastructure/pg-projections';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';

registerLauréatQueries({
  find: findProjection,
  list: listProjection,
  listV2: listProjectionV2,
  consulterCahierDesChargesAdapter: consulterCahierDesChargesChoisiAdapter,
  listerAbandonsPourPorteur: listerAbandonsPourPorteurAdapter,
  buildModèleRéponseAbandon: getModèleRéponseAbandon,
  listerAbandons: listerAbandonsAdapter,
  récupérerRégionDreal: récupérerRégionDrealAdapter,
  buildModèleMiseEnDemeureGarantiesFinancières: getModèleMiseEnDemeureGarantiesFinancières,
});

registerLauréatUseCases({
  loadAggregate,
});

type CsvGFType = '1' | '2' | '3';

const parseCsv = async (filePath: string) => {
  try {
    const content = (await readFile(filePath, 'utf8')).split('\n');

    const [_, ...rows] = content;

    return rows
      .filter((line) => line)
      .map((line) => {
        const [appelOffre, periode, famille, numeroCRE, typeGF, dateÉchéance] = line.split(';');

        return {
          appelOffre,
          periode,
          famille,
          numeroCRE,
          typeGF: typeGF as CsvGFType,
          ...(dateÉchéance && { dateÉchéance }),
        };
      });
  } catch (e) {
    throw new Error(`💩 Error while parsing CSV file 💩`);
  }
};

const getGFType = (typeGF: CsvGFType): GarantiesFinancières.TypeGarantiesFinancières.RawType => {
  switch (typeGF) {
    case '1':
      return 'six-mois-après-achèvement';
    case '2':
      return 'avec-date-échéance';
    case '3':
      return 'consignation';
    default:
      return 'type-inconnu';
  }
};

const convertFrStringToDate = (date: string): string => {
  const [day, month, year] = date.split('/');
  return new Date(`${year}-${month}-${day}`).toISOString();
};

(async () => {
  const errors: Array<string> = [];
  const success: Array<string> = [];
  const file = './rattraper-type-gfs-file.csv';
  try {
    const lines = await parseCsv(file);
    if (lines.length === 0) {
      throw new Error('💩 No lines found, empty file 💩');
    }

    for (const { appelOffre, periode, famille, numeroCRE, dateÉchéance, typeGF } of lines) {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        `${appelOffre}#${periode}#${famille}#${numeroCRE}`,
      ).formatter();

      const type = getGFType(typeGF);
      const dateÉchéanceValue = dateÉchéance
        ? DateTime.convertirEnValueType(convertFrStringToDate(dateÉchéance)).formatter()
        : undefined;

      try {
        await mediator.send<GarantiesFinancières.ImporterTypeGarantiesFinancièresUseCase>({
          type: 'Lauréat.GarantiesFinancières.UseCase.ImporterTypeGarantiesFinancières',
          data: {
            identifiantProjetValue: identifiantProjet,
            typeValue: type,
            dateÉchéanceValue,
            importéLeValue: DateTime.now().formatter(),
          },
        });
        success.push(
          `✅ Success : Projet ${identifiantProjet} has a fresh GF type (${type}) ${
            dateÉchéance ? `with date échéance ${dateÉchéance}` : ''
          } ✅`,
        );
      } catch (error) {
        errors.push(
          `🩸 Error : Projet ${identifiantProjet} has error while importing the GF type => ${error}`,
        );
        continue;
      }
    }
  } catch (error) {
    errors.push((error as Error).message);
  } finally {
    const errorsFile = createWriteStream(`errors-${DateTime.now().formatter()}.log`);
    errorsFile.write(errors.join('\n'));
    errorsFile.end();

    const successFile = createWriteStream(`success-${DateTime.now().formatter()}.log`);
    successFile.write(success.join('\n'));
    successFile.end();

    console.log('🍀 Done !');
    process.exit(0);
  }
})();
