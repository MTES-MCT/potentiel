import { Given as EtantDonné, DataTable } from '@cucumber/cucumber';
import { PotentielWorld } from '../../../potentiel.world';
import {
  DomainUseCase,
  GarantiesFinancièresSnapshotEvent,
  TypeGarantiesFinancières,
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

EtantDonné(
  `des garanties financières (avec une attestation )(avec un type et une date d'échéance )(complètes )pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();

    const typeGarantiesFinancières = exemple['type'] as TypeGarantiesFinancières;
    const dateÉchéance = exemple[`date d'échéance`];
    const format = exemple['format'];
    const dateConstutition = exemple[`date de constitution`];
    const contenuFichier = convertStringToReadableStream(exemple['contenu fichier']);

    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    await mediator.send<DomainUseCase>({
      type: 'ENREGISTRER_GARANTIES_FINANCIÈRES_USE_CASE',
      data: {
        ...(format &&
          dateConstutition && {
            attestationConstitution: {
              format,
              date: convertirEnDateTime(dateConstutition),
              content: contenuFichier,
            },
          }),
        ...(typeGarantiesFinancières && {
          typeGarantiesFinancières,
          ...(dateÉchéance && { dateÉchéance: convertirEnDateTime(dateÉchéance) }),
        }),
        utilisateur: { rôle: 'admin' } as Utilisateur,
        identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
      },
    });
    await sleep(500);
  },
);

EtantDonné(
  `des garanties financières migrées pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();

    const typeGarantiesFinancières = exemple['type'] as TypeGarantiesFinancières;
    const dateÉchéance = exemple[`date d'échéance`];
    const format = exemple['format'];
    const dateConstutition = exemple[`date de constitution`];
    const contenuFichier = convertStringToReadableStream(exemple['contenu fichier']);

    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    const event: GarantiesFinancièresSnapshotEvent = {
      type: 'GarantiesFinancièresSnapshot-v1',
      payload: {
        identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet).formatter(),
        aggregate: {
          actuelles: {
            typeGarantiesFinancières,
            attestationConstitution: {
              format: format,
              date: convertirEnDateTime(dateConstutition).formatter(),
            },
            ...(dateÉchéance && { dateÉchéance: convertirEnDateTime(dateÉchéance).formatter() }),
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
