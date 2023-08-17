import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
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
import { PotentielWorld } from '../../../potentiel.world';
import { mediator } from 'mediateur/dist/core/mediator';
import { upload } from '@potentiel/file-storage';
import { publish } from '@potentiel/pg-event-sourcing';
import { extension } from 'mime-types';
import { join } from 'path';

EtantDonné(
  `un dépôt de garanties financières pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();
    const dateÉchéance = exemple[`date d'échéance`];
    const format = exemple['format'];
    const dateConstutition = exemple[`date de constitution`];
    const contenuFichier = convertStringToReadable(exemple['contenu fichier']);
    const dateDépôt = exemple['date de dépôt'];
    const typeGarantiesFinancières = exemple['type'] as TypeGarantiesFinancières;

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
        utilisateur: { rôle: 'porteur-projet' } as Utilisateur,
        identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
        dateDépôt: convertirEnDateTime(dateDépôt),
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
    const dateConstutition = exemple[`date de constitution`];
    const contenuFichier = convertStringToReadable(exemple['contenu fichier']);
    const dateDépôt = exemple['date de dépôt'];
    const typeGarantiesFinancières = exemple['type'] as TypeGarantiesFinancières;

    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    const event: GarantiesFinancièresSnapshotEvent = {
      type: 'GarantiesFinancièresSnapshot-v1',
      payload: {
        identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet).formatter(),
        aggregate: {
          dépôt: {
            typeGarantiesFinancières,
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
  },
);
