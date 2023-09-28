import { DataTable, When as Quand } from '@cucumber/cucumber';
import {
  DomainUseCase,
  GarantiesFinancièresSnapshotEventV1,
  Utilisateur,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
  createGarantiesFinancièresAggregateId,
} from '@potentiel/domain';
import { sleep } from '../../../helpers/sleep';
import { mediator } from 'mediateur';
import { publish } from '@potentiel/pg-event-sourcing';
import { join } from 'path';
import { extension } from 'mime-types';
import { upload } from '@potentiel/file-storage';
import { convertStringToReadableStream } from '../../../helpers/convertStringToReadable';

Quand(
  'un utilisateur avec le rôle porteur-projet dépose des garanties financières pour le projet {string} avec :',
  async function (nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const typeGarantiesFinancières = exemple['type'] as
        | 'consignation'
        | "avec date d'échéance"
        | '6 mois après achèvement';
      const dateÉchéance = exemple[`date d'échéance`];
      const format = exemple['format'];
      const dateConstitution = exemple[`date de constitution`];
      const contenuFichier = convertStringToReadableStream(exemple['contenu fichier']);
      const dateDépôt = exemple['date de dépôt'];

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
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un utilisateur avec le rôle porteur-projet dépose des garanties financières pour le projet {string} avec une date de constitution dans le futur`,
  async function (nomProjet: string) {
    try {
      const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

      const dateFuture = new Date('2050-01-01');

      await mediator.send<DomainUseCase>({
        type: 'DÉPOSER_GARANTIES_FINANCIÈRES_USE_CASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
          dateDépôt: convertirEnDateTime(new Date('2023-09-28')),
          attestationConstitution: {
            format: 'Application/pdf',
            date: convertirEnDateTime(dateFuture),
            content: convertStringToReadableStream('contenu'),
          },
          typeGarantiesFinancières: 'consignation',
        },
      });
      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un utilisateur avec le rôle porteur-projet dépose des garanties financières de type avec date d'échéance pour le projet {string} sans préciser cette date`,
  async function (nomProjet: string) {
    try {
      const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);
      //@ts-ignore
      await mediator.send<DomainUseCase>({
        type: 'DÉPOSER_GARANTIES_FINANCIÈRES_USE_CASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
          dateDépôt: convertirEnDateTime(new Date('2023-09-28')),
          attestationConstitution: {
            format: 'Application/pdf',
            date: convertirEnDateTime(new Date('2050-01-01')),
            content: convertStringToReadableStream('contenu'),
          },
          typeGarantiesFinancières: "avec date d'échéance",
          // on retire la date d'échéance pour le test
        },
      });
      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un utilisateur avec le rôle porteur-projet dépose des garanties financières pour le projet {string} avec un type non compatible avec une date d'échéance, avec :`,
  async function (nomProjet: string, table: DataTable) {
    try {
      const exemple = table.rowsHash();
      const typeGarantiesFinancières = exemple['type'];
      const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

      await mediator.send<DomainUseCase>({
        type: 'DÉPOSER_GARANTIES_FINANCIÈRES_USE_CASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
          dateDépôt: convertirEnDateTime(new Date('2023-09-28')),
          attestationConstitution: {
            format: 'Application/pdf',
            date: convertirEnDateTime(new Date('2050-01-01')),
            content: convertStringToReadableStream('contenu'),
          },
          //@ts-ignore
          // on ajoute à tort une date d'échéance pour le test
          typeGarantiesFinancières,
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
  `un utilisateur avec le rôle porteur-projet modifie un dépôt de garanties financières pour le projet {string} avec :`,
  async function (nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const typeGarantiesFinancières = exemple['type'] as
        | 'consignation'
        | "avec date d'échéance"
        | '6 mois après achèvement';
      const dateÉchéance = exemple[`date d'échéance`];
      const format = exemple['format'];
      const dateConstitution = exemple[`date de constitution`];
      const contenuFichier = convertStringToReadableStream(exemple['contenu fichier']);
      const dateModification = exemple['date de modification'];

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
        type: 'MODIFIER_DÉPÔT_GARANTIES_FINANCIÈRES_USE_CASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
          utilisateur: { rôle: 'porteur-projet' } as Utilisateur,
          dateModification: convertirEnDateTime(dateModification),
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
  `un utilisateur avec le rôle porteur-projet modifie un dépôt de garanties financières pour le projet {string} avec une date de constitution dans le futur`,
  async function (nomProjet: string) {
    try {
      const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

      const dateFuture = new Date('2050-09-01');

      await mediator.send<DomainUseCase>({
        type: 'MODIFIER_DÉPÔT_GARANTIES_FINANCIÈRES_USE_CASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
          utilisateur: { rôle: 'porteur-projet' } as Utilisateur,
          dateModification: convertirEnDateTime(new Date('2023-09-01')),
          attestationConstitution: {
            format: 'Application/pdf',
            date: convertirEnDateTime(dateFuture),
            content: convertStringToReadableStream('contenu'),
          },
          typeGarantiesFinancières: 'consignation',
        },
      });
      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un utilisateur avec le rôle porteur-projet modifie un dépôt de garanties financières pour le projet {string} avec la date d'échéance manquante`,
  async function (nomProjet: string) {
    try {
      const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

      //@ts-ignore
      //date d'échéance manquante pour le test
      await mediator.send<DomainUseCase>({
        type: 'MODIFIER_DÉPÔT_GARANTIES_FINANCIÈRES_USE_CASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
          utilisateur: { rôle: 'porteur-projet' } as Utilisateur,
          dateModification: convertirEnDateTime(new Date('2023-09-01')),
          attestationConstitution: {
            format: 'Application/pdf',
            date: convertirEnDateTime(new Date('2050-09-01')),
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
  `un utilisateur avec le rôle porteur-projet modifie un dépôt de garanties financières pour le projet {string} avec un type et une date d'échéance non compatibles, avec :`,
  async function (nomProjet: string, table: DataTable) {
    try {
      const exemple = table.rowsHash();
      const typeGarantiesFinancières = exemple['type'];
      const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

      await mediator.send<DomainUseCase>({
        type: 'MODIFIER_DÉPÔT_GARANTIES_FINANCIÈRES_USE_CASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
          utilisateur: { rôle: 'porteur-projet' } as Utilisateur,
          dateModification: convertirEnDateTime(new Date('2023-09-01')),
          attestationConstitution: {
            format: 'Application/pdf',
            date: convertirEnDateTime(new Date('2050-09-01')),
            content: convertStringToReadableStream('contenu'),
          },
          //@ts-ignore
          // date d'échéance ajoutée à tort pour le test
          typeGarantiesFinancières,
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
  `un développeur migre un dépôt de garanties financières sans type pour le projet {string} avec :`,
  async function (nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const dateÉchéance = exemple[`date d'échéance`];
      const format = exemple['format'];
      const dateConstitution = exemple[`date de constitution`];
      const contenuFichier = convertStringToReadableStream(exemple['contenu fichier']);
      const dateDépôt = exemple['date de dépôt'];

      const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

      const event: GarantiesFinancièresSnapshotEventV1 = {
        type: 'GarantiesFinancièresSnapshot-v1',
        payload: {
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet).formatter(),
          aggregate: {
            dépôt: {
              typeGarantiesFinancières: 'Type inconnu',
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
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'un utilisateur avec le rôle Dreal valide le dépôt de garanties financières pour le projet {string} avec :',
  async function (nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

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
        type: 'VALIDER_DÉPÔT_GARANTIES_FINANCIÈRES_USE_CASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
          utilisateur: { rôle: 'dreal' } as Utilisateur,
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
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'un utilisateur avec le rôle porteur-projet supprime le dépôt de garanties financières pour le projet {string}',
  async function (nomProjet: string) {
    try {
      const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

      await mediator.send<DomainUseCase>({
        type: 'SUPPRIMER_DÉPÔT_GARANTIES_FINANCIÈRES_USE_CASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
