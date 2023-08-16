import { DataTable, When as Quand } from '@cucumber/cucumber';
import {
  DomainUseCase,
  GarantiesFinancièresSnapshotEvent,
  TypeGarantiesFinancières,
  Utilisateur,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
  createGarantiesFinancièresAggregateId,
} from '@potentiel/domain';
import { convertStringToReadable } from '../../../helpers/convertStringToReadable';
import { sleep } from '../../../helpers/sleep';
import { mediator } from 'mediateur';
import { publish } from '@potentiel/pg-event-sourcing';
import { join } from 'path';
import { extension } from 'mime-types';
import { upload } from '@potentiel/file-storage';

Quand(
  'un utilisateur avec le rôle {string} dépose des garanties financières pour le projet {string} avec :',
  async function (rôle: string, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const typeGarantiesFinancières = exemple['type'] as TypeGarantiesFinancières;
      const dateÉchéance = exemple[`date d'échéance`];
      const format = exemple['format'];
      const dateConstutition = exemple[`date de constitution`];
      const contenuFichier = convertStringToReadable(exemple['contenu fichier']);
      const dateDépôt = exemple['date de dépôt'];

      const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

      await mediator.send<DomainUseCase>({
        type: 'DÉPOSER_GARANTIES_FINANCIÈRES_USE_CASE',
        data: {
          attestationConstitution: {
            format,
            date: convertirEnDateTime(dateConstutition),
            content: contenuFichier,
          },
          typeGarantiesFinancières,
          ...(dateÉchéance && { dateÉchéance: convertirEnDateTime(dateÉchéance) }),
          utilisateur: { rôle } as Utilisateur,
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
          dateDépôt: convertirEnDateTime(dateDépôt),
        },
      });
      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un utilisateur avec le rôle {string} modifie un dépôt de garanties financières pour le projet {string} avec :`,
  async function (rôle: string, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const typeGarantiesFinancières = exemple['type'] as TypeGarantiesFinancières;
      const dateÉchéance = exemple[`date d'échéance`];
      const format = exemple['format'];
      const dateConstutition = exemple[`date de constitution`];
      const contenuFichier = convertStringToReadable(exemple['contenu fichier']);

      const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

      await mediator.send<DomainUseCase>({
        type: 'MODIFIER_DÉPÔT_GARANTIES_FINANCIÈRES_USE_CASE',
        data: {
          attestationConstitution: {
            format,
            date: convertirEnDateTime(dateConstutition),
            content: contenuFichier,
          },
          typeGarantiesFinancières,
          ...(dateÉchéance && { dateÉchéance: convertirEnDateTime(dateÉchéance) }),
          utilisateur: { rôle } as Utilisateur,
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
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
      const dateConstutition = exemple[`date de constitution`];
      const contenuFichier = convertStringToReadable(exemple['contenu fichier']);
      const dateDépôt = exemple['date de dépôt'];

      const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

      const event: GarantiesFinancièresSnapshotEvent = {
        type: 'GarantiesFinancièresSnapshot',
        payload: {
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet).formatter(),
          aggregate: {
            dépôt: {
              attestationConstitution: {
                format: format,
                date: convertirEnDateTime(dateConstutition).formatter(),
              },
              dateDépôt: convertirEnDateTime(dateDépôt).formatter(),
              ...(dateÉchéance && { dateÉchéance: convertirEnDateTime(dateÉchéance).formatter() }),
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
