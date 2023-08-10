import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import {
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
  createDépôtGarantiesFinancièresAggregateId,
  GarantiesFinancièresDéposéesV0,
} from '@potentiel/domain';
import { convertStringToReadable } from '../../helpers/convertStringToReadable';
import { sleep } from '../../helpers/sleep';
import { PotentielWorld } from '../../potentiel.world';
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

    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    // DATA
    const event: GarantiesFinancièresDéposéesV0 = {
      type: 'GarantiesFinancièresDéposées-v0',
      payload: {
        identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet).formatter(),
        attestationConstitution: {
          format: format,
          date: convertirEnDateTime(dateConstutition).formatter(),
        },
        dateDépôt: convertirEnDateTime(dateDépôt).formatter(),
        ...(dateÉchéance && { dateÉchéance: convertirEnDateTime(dateÉchéance).formatter() }),
      },
    };

    await publish(
      createDépôtGarantiesFinancièresAggregateId(convertirEnIdentifiantProjet(identifiantProjet)),
      event,
    );

    // FILE
    const path = join(
      convertirEnIdentifiantProjet(identifiantProjet).formatter(),
      `depot-attestation-constitution-garanties-financieres.${extension(format)}`,
    );

    await upload(path, contenuFichier);

    await sleep(500);
  },
);
