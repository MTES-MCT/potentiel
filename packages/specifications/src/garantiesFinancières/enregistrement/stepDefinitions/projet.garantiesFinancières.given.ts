import { Given as EtantDonné, DataTable } from '@cucumber/cucumber';
import { PotentielWorld } from '../../../potentiel.world';
import {
  DomainUseCase,
  GarantiesFinancièresSnapshotEventV1,
  Utilisateur,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
  createGarantiesFinancièresAggregateId,
} from '@potentiel/domain';
import { mediator } from 'mediateur';
import { sleep } from '../../../helpers/sleep';
import { upload } from '@potentiel/file-storage';
import { publish } from '@potentiel/pg-event-sourcing';
import { extension } from 'mime-types';
import { join } from 'path';
import { convertStringToReadableStream } from '../../../helpers/convertStringToReadable';
import { GarantiesFinancièresUseCase } from '@potentiel/domain/src/garantiesFinancières/garantiesFinancières.usecase';

EtantDonné(
  `des garanties financières pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();

    const typeGarantiesFinancières = exemple['type'] as
      | 'consignation'
      | "avec date d'échéance"
      | '6 mois après achèvement';
    const dateÉchéance = exemple[`date d'échéance`];
    const format = exemple['format'];
    const dateConstitution = exemple[`date de constitution`];
    const contenuFichier = convertStringToReadableStream(exemple['contenu fichier']);

    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    if (
      !['consignation', "avec date d'échéance", '6 mois après achèvement'].includes(
        typeGarantiesFinancières,
      )
    ) {
      throw new Error('le type renseigné dans le test est incorrect');
    }

    if (typeGarantiesFinancières === "avec date d'échéance" && !dateÉchéance) {
      throw new Error("il manque une date d'échéance pour ce type de garanties financières");
    }

    await mediator.send<DomainUseCase>({
      type: 'ENREGISTRER_GARANTIES_FINANCIÈRES_USE_CASE',
      data: {
        utilisateur: { rôle: 'admin' } as Utilisateur,
        identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
        attestationConstitution: {
          format,
          date: convertirEnDateTime(dateConstitution),
          content: contenuFichier,
        },
        ...(typeGarantiesFinancières === "avec date d'échéance"
          ? {
              typeGarantiesFinancières,
              dateÉchéance: convertirEnDateTime(dateÉchéance),
            }
          : { typeGarantiesFinancières }),
      },
    });
    await sleep(500);
  },
);

EtantDonné(
  `des garanties financières importées pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();

    const typeGarantiesFinancières = exemple['type'] as
      | 'consignation'
      | "avec date d'échéance"
      | '6 mois après achèvement';
    const dateÉchéance = exemple[`date d'échéance`];

    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    if (
      !['consignation', "avec date d'échéance", '6 mois après achèvement'].includes(
        typeGarantiesFinancières,
      )
    ) {
      throw new Error('le type renseigné dans le test est incorrect');
    }

    if (typeGarantiesFinancières === "avec date d'échéance" && !dateÉchéance) {
      throw new Error("il manque une date d'échéance pour ce type de garanties financières");
    }

    await mediator.send<GarantiesFinancièresUseCase>({
      type: 'IMPORTER_TYPE_GARANTIES_FINANCIÈRES_USE_CASE',
      data: {
        identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
        ...(typeGarantiesFinancières === "avec date d'échéance"
          ? {
              typeGarantiesFinancières,
              dateÉchéance: convertirEnDateTime(dateÉchéance),
            }
          : { typeGarantiesFinancières }),
      },
    });
    await sleep(500);
  },
);

EtantDonné(
  `des garanties financières migrées pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();

    const typeGarantiesFinancières = exemple['type'] as
      | 'consignation'
      | "avec date d'échéance"
      | '6 mois après achèvement';
    const dateÉchéance = exemple[`date d'échéance`];
    const format = exemple['format'];
    const dateConstitution = exemple[`date de constitution`];
    const contenuFichier = convertStringToReadableStream(exemple['contenu fichier']);

    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    const event: GarantiesFinancièresSnapshotEventV1 = {
      type: 'GarantiesFinancièresSnapshot-v1',
      payload: {
        identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet).formatter(),
        aggregate: {
          actuelles: {
            typeGarantiesFinancières,
            attestationConstitution: {
              format: format,
              date: convertirEnDateTime(dateConstitution).formatter(),
            },
            dateÉchéance: dateÉchéance
              ? convertirEnDateTime(dateÉchéance).formatter()
              : 'Date inconnue',
          },
        },
      },
    };

    await publish(
      createGarantiesFinancièresAggregateId(convertirEnIdentifiantProjet(identifiantProjet)),
      event,
    );

    await sleep(100);

    const path = join(
      convertirEnIdentifiantProjet(identifiantProjet).formatter(),
      `attestation-constitution-garanties-Financieres.${extension(format)}`,
    );

    await upload(path, contenuFichier);

    await sleep(500);
  },
);
