import zod from 'zod';
import { Command } from '@oclif/core';

import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { ExportCSV } from '@potentiel-libraries/csv';
import { DateTime } from '@potentiel-domain/common';

const envSchema = zod.object({
  DATAGOUV_API_URL: zod.url(),
  DATAGOUV_API_KEY: zod.string(),
  DATAGOUV_DATASET_ID: zod.string(),
  DATAGOUV_RESSOURCE_ID: zod.string(),
});

type DataLine = {
  cycle_appel_offres: string;
  appel_offres: string;
  periode: string;
  famille: string;
  statut_projet: string;
  region_projet: string;
  departement_projet: string;
  type_actionnariat?: string;
  date_de_notification: string;
  unite_puissance: string;
  puissance_cumulee: string;
  puissance_moyenne: string;
  ecs_moyenne: string;
  nombre_de_projets: string;
};

export class PublierDatagouvStats extends Command {
  async run() {
    try {
      const env = envSchema.parse(process.env);

      const buffer = await this.generateCsvBuffer();

      await this.uploadCsv({
        buffer,
        apiUrl: env.DATAGOUV_API_URL,
        datasetId: env.DATAGOUV_DATASET_ID,
        resourceId: env.DATAGOUV_RESSOURCE_ID,
        apiKey: env.DATAGOUV_API_KEY,
      });
    } catch (err) {
      this.error(err instanceof Error ? err.message : String(err));
    }
  }

  async generateCsvBuffer() {
    const data = (
      await executeSelect<DataLine>(`select * from domain_public_statistic.indicateurs_projets`)
    ).map((line) => ({
      ...line,
      type_actionnariat: line.type_actionnariat ?? '',
      date_de_notification: DateTime.convertirEnValueType(line.date_de_notification)
        .date.toISOString()
        .split('T')[0],
    }));

    const csv = await ExportCSV.toCSV({
      data,
      fields: [
        'cycle_appel_offres',
        'appel_offres',
        'periode',
        'famille',
        'statut_projet',
        'departement_projet',
        'type_actionnariat',
        'date_de_notification',
        'unite_puissance',
        'puissance_cumulee',
        'puissance_moyenne',
        'ecs_moyenne',
        'nombre_de_projets',
      ],
    });

    return Buffer.from(csv, 'utf8');
  }

  async uploadCsv({
    buffer,
    apiUrl,
    datasetId,
    resourceId,
    apiKey,
  }: {
    buffer: Buffer;
    apiUrl: string;
    datasetId: string;
    resourceId: string;
    apiKey: string;
  }) {
    const fileName = 'projets_enr_appels_offres_en_france.csv';

    const form = new FormData();
    form.append('file', new Blob([buffer]), fileName);
    form.append('title', fileName);
    form.append('format', 'csv');
    form.append('type', 'main');

    const url = `${apiUrl}/datasets/${datasetId}/resources/${resourceId}/upload/`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey },
      body: form,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    this.log('Ressource mise à jour');
  }
}
