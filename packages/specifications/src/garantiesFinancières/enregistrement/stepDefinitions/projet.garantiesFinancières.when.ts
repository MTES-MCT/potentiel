import { When as Quand, DataTable } from '@cucumber/cucumber';
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
import { convertStringToReadableStream } from '../../../helpers/convertStringToReadable';
import { upload } from '@potentiel/file-storage';
import { publish } from '@potentiel/pg-event-sourcing';
import { extension } from 'mime-types';
import { join } from 'path';

Quand(
  `un utilisateur avec le rôle {string} importe le type des garanties financières pour le projet {string} avec :`,
  async function (this: PotentielWorld, rôle: string, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();

    try {
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

      await mediator.send<DomainUseCase>({
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
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un utilisateur avec le rôle {string} enregistre des garanties financières pour le projet {string} avec :`,
  async function (this: PotentielWorld, rôle: string, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();

    try {
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
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
          utilisateur: { rôle } as Utilisateur,
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
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un utilisateur enregistre des garanties financières avec un type inexistant pour le projet {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    try {
      const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

      await mediator.send<DomainUseCase>({
        type: 'ENREGISTRER_GARANTIES_FINANCIÈRES_USE_CASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
          utilisateur: { rôle: 'admin' } as Utilisateur,
          attestationConstitution: {
            format: 'Application/pdf',
            date: convertirEnDateTime(new Date('2023-01-01')),
            content: convertStringToReadableStream('contenu'),
          },
          //@ts-ignore
          typeGarantiesFinancières: 'type-inexistant',
        },
      });
      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un utilisateur enregistre des garanties financières avec un type et une date d'échéance incompatibles pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();

    try {
      const typeGarantiesFinancières = exemple['type'] as
        | 'consignation'
        | '6 mois après achèvement';

      const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

      await mediator.send<DomainUseCase>({
        type: 'ENREGISTRER_GARANTIES_FINANCIÈRES_USE_CASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
          utilisateur: { rôle: 'admin' } as Utilisateur,
          attestationConstitution: {
            format: 'Application/pdf',
            date: convertirEnDateTime(new Date('2023-01-01')),
            content: convertStringToReadableStream('contenu'),
          },
          typeGarantiesFinancières,
          //@ts-ignore
          // date d'échéance ajoutée à tort pour le test
          dateÉchéance: convertirEnDateTime(new Date('2030-01-01')),
        },
      });
      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un utilisateur enregistre des garanties financières de type avec date d'échéance sans préciser la date pour le projet {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    try {
      const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

      //@ts-ignore
      // date d'échéance manquante pour le test
      await mediator.send<DomainUseCase>({
        type: 'ENREGISTRER_GARANTIES_FINANCIÈRES_USE_CASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
          utilisateur: { rôle: 'admin' } as Utilisateur,
          attestationConstitution: {
            format: 'Application/pdf',
            date: convertirEnDateTime(new Date('2023-01-01')),
            content: convertStringToReadableStream('contenu'),
          },
          typeGarantiesFinancières: "avec date d'échéance",
        },
      });
      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un développeur migre des garanties financières legacy pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();

    try {
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
        `attestation-constitution-garanties-financieres.${extension(format)}`,
      );

      await upload(path, contenuFichier);
      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);
