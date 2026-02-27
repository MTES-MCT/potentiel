import { unlink, writeFile } from 'node:fs/promises';

import zod from 'zod';
import { Command } from '@oclif/core';

import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { ExportCSV } from '@potentiel-libraries/csv';

const envSchema = zod.object({
  DATAGOUV_API_URL: zod.url(),
  DATAGOUV_API_KEY: zod.string(),
  DATAGOUV_DATASET_ID: zod.string(),
});

type DataLine = {
  appel_offres: string;
  periode: string;
  famille: string;
  statut_projet: string;
  region_projet: string;
  departement_projet: string;
  type_actionnariat?: string;
  date_de_notification: string;
  puissance_cumulee: string;
  puissance_moyenne: string;
  ecs_moyenne: string;
};

type FileToUpload = {
  path: string;
  format: string;
  type: string;
  buffer: Buffer;
};

type DataGouvResource = {
  id: string;
  title: string;
  format: string;
  type: string;
  url?: string;
};

type DatasetResponse = {
  resources: DataGouvResource[];
};

export class UpdateRessources extends Command {
  #apiUrl!: string;
  #datasetId!: string;
  #apiKey!: string;

  async init() {
    const env = envSchema.parse(process.env);
    this.#apiUrl = env.DATAGOUV_API_URL;
    this.#datasetId = env.DATAGOUV_DATASET_ID;
    this.#apiKey = env.DATAGOUV_API_KEY;
  }

  async createFile(): Promise<FileToUpload> {
    const csvPath = 'data.csv';

    const rawData = await executeSelect<DataLine>(
      `select * from domain_public_statistic.indicateurs_projets`,
    );
    const csvContent = await ExportCSV.toCSV({
      data: rawData,
      fields: [
        'appel_offres',
        'periode',
        'famille',
        'statut_projet',
        'departement_projet',
        'type_actionnariat',
        'date_de_notification',
        'puissance_cumulee',
        'puissance_moyenne',
        'ecs_moyenne',
      ],
    });

    const buffer = Buffer.from(csvContent, 'utf8');

    await writeFile(csvPath, buffer);

    this.log(`Fichier CSV généré : ${csvPath}`);

    return { path: csvPath, format: 'csv', type: 'main', buffer };
  }

  async getExistingResources(): Promise<DataGouvResource[]> {
    const response = await fetch(`${this.#apiUrl}/datasets/${this.#datasetId}/`, {
      headers: {
        'X-API-KEY': this.#apiKey,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status} - ${text}`);
    }

    const data = (await response.json()) as DatasetResponse;
    return data.resources || [];
  }

  async uploadFile(file: FileToUpload, existingResources: DataGouvResource[]) {
    const fileName = file.path.split('/').pop()!;
    const existing = existingResources.find((r) => r.title === fileName);

    const form = new FormData();
    form.append('file', new Blob([file.buffer]), fileName);
    form.append('title', fileName);
    form.append('format', file.format);
    form.append('type', file.type);
    form.append('private', 'true');

    const url = existing
      ? `${this.#apiUrl}/datasets/${this.#datasetId}/resources/${existing.id}/upload/`
      : `${this.#apiUrl}/datasets/${this.#datasetId}/upload/`;

    this.log(existing ? `Mise à jour : ${fileName}` : `Création : ${fileName}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-API-KEY': this.#apiKey,
      },
      body: form,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status} - ${text}`);
    }

    const data = await response.json();
    this.log(`Publication réussie pour ${fileName}`, data);
  }

  async run() {
    let file: FileToUpload | undefined;
    try {
      file = await this.createFile();
      const existingResources = await this.getExistingResources();
      await this.uploadFile(file, existingResources);
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.error(`Erreur : ${err.message}`);
      } else {
        this.error(`Erreur inconnue : ${String(err)}`);
      }
    } finally {
      if (file) {
        await unlink(file.path).catch(() => {});
        this.log(`Fichier temporaire supprimé : ${file.path}`);
      }
    }
  }
}
