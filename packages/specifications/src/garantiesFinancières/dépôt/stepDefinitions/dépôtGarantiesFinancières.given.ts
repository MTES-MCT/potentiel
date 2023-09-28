import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import {
  DomainUseCase,
  GarantiesFinancièresSnapshotEventV1,
  Utilisateur,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
  createGarantiesFinancièresAggregateId,
} from '@potentiel/domain';
import { sleep } from '../../../helpers/sleep';
import { PotentielWorld } from '../../../potentiel.world';
import { mediator } from 'mediateur/dist/core/mediator';
import { upload } from '@potentiel/file-storage';
import { publish } from '@potentiel/pg-event-sourcing';
import { extension } from 'mime-types';
import { join } from 'path';
import { convertStringToReadableStream } from '../../../helpers/convertStringToReadable';

EtantDonné(
  `un dépôt de garanties financières pour le projet {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    await mediator.send<DomainUseCase>({
      type: 'DÉPOSER_GARANTIES_FINANCIÈRES_USE_CASE',
      data: {
        identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
        dateDépôt: convertirEnDateTime(new Date('2023-09-01')),
        attestationConstitution: {
          format: 'Application/pdf',
          date: convertirEnDateTime(new Date('2023-09-01')),
          content: convertStringToReadableStream('contenu'),
        },
        typeGarantiesFinancières: 'consignation',
      },
    });
    await sleep(500);
  },
);

EtantDonné(
  `un dépôt de garanties financières pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();
    const dateÉchéance = exemple[`date d'échéance`];
    const format = exemple['format'];
    const dateConstitution = exemple[`date de constitution`];
    const contenuFichier = convertStringToReadableStream(exemple['contenu fichier']);
    const dateDépôt = exemple['date de dépôt'];
    const typeGarantiesFinancières = exemple['type'] as
      | 'consignation'
      | "avec date d'échéance"
      | '6 mois après achèvement';

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
      type: 'DÉPOSER_GARANTIES_FINANCIÈRES_USE_CASE',
      data: {
        identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
        dateDépôt: convertirEnDateTime(dateDépôt),
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
  `un dépôt de garanties financières migré pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();
    const dateÉchéance = exemple[`date d'échéance`];
    const format = exemple['format'];
    const dateConstitution = exemple[`date de constitution`];
    const contenuFichier = convertStringToReadableStream(exemple['contenu fichier']);
    const dateDépôt = exemple['date de dépôt'];
    const typeGarantiesFinancières = exemple['type'] as
      | 'consignation'
      | "avec date d'échéance"
      | '6 mois après achèvement';

    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    const event: GarantiesFinancièresSnapshotEventV1 = {
      type: 'GarantiesFinancièresSnapshot-v1',
      payload: {
        identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet).formatter(),
        aggregate: {
          dépôt: {
            typeGarantiesFinancières,
            attestationConstitution: {
              format: format,
              date: convertirEnDateTime(dateConstitution).formatter(),
            },
            dateDépôt: convertirEnDateTime(dateDépôt).formatter(),
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

    const path = join(
      convertirEnIdentifiantProjet(identifiantProjet).formatter(),
      `depot-attestation-constitution-garanties-financieres.${extension(format)}`,
    );

    await upload(path, contenuFichier);

    await sleep(500);
  },
);

EtantDonné(
  `une validation du dépôt de garanties financières par la Dreal pour le projet {string} avec :`,
  async function (nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

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
      type: 'VALIDER_DÉPÔT_GARANTIES_FINANCIÈRES_USE_CASE',
      data: {
        utilisateur: { rôle: 'dreal' } as Utilisateur,
        identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
        attestationConstitution: {
          format,
          content: contenuFichier,
          date: convertirEnDateTime(dateConstitution),
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
