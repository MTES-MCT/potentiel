import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
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
import { getLogger } from '@potentiel-libraries/monitoring';

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

const checkFileExists = (filePath: string) => (existsSync(filePath) ? true : false);

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
  const file = './rattraper-type-gfs-file.csv';

  const fileExists = checkFileExists(file);

  if (!fileExists) {
    getLogger().error(new Error(`❌ File ${file} doesn't exist ❌`));
    process.exit(1);
  }

  const lines = await parseCsv(file);

  if (lines.length === 0) {
    getLogger().error(new Error('❌ No lines found, empty file ❌'));
    process.exit(1);
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

      getLogger().info(
        `✅ Success : Projet ${identifiantProjet} has a fresh GF type (${type}) ${
          dateÉchéance ? `with date échéance ${dateÉchéance}` : ''
        }`,
      );
    } catch (error) {
      getLogger().error(
        new Error(
          `❌ Error : Projet ${identifiantProjet} has error while importing the GF type => ${error}`,
        ),
      );
    }
  }

  getLogger().info(`🎉 Process ended 🎉`);
  process.exit(0);
})();
