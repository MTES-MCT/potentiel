import { Given as EtantDonné, DataTable } from '@cucumber/cucumber';
import { PotentielWorld } from '../../../potentiel.world';
import {
  AttestationGarantiesFinancièresEnregistréeEvent,
  DomainUseCase,
  TypeGarantiesFinancières,
  TypeGarantiesFinancièresEnregistréSnapshotV1,
  Utilisateur,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
  createGarantiesFinancièresAggregateId,
} from '@potentiel/domain';
import { mediator } from 'mediateur';
import { sleep } from '../../../helpers/sleep';
import { convertStringToReadable } from '../../../helpers/convertStringToReadable';
import { upload } from '@potentiel/file-storage';
import { publish } from '@potentiel/pg-event-sourcing';
import { extension } from 'mime-types';
import { join } from 'path';

EtantDonné(
  `des garanties financières (avec une attestation )(avec un type et une date d'échéance )(complètes )pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();

    const typeGarantiesFinancières = exemple['type'] as TypeGarantiesFinancières;
    const dateÉchéance = exemple[`date d'échéance`];
    const format = exemple['format'];
    const dateConstutition = exemple[`date de constitution`];
    const contenuFichier = convertStringToReadable(exemple['contenu fichier']);

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
    const contenuFichier = convertStringToReadable(exemple['contenu fichier']);

    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    // TYPE
    // comme on ne passe pas par une commande pour la migration, on vérifie le type ici
    const typePayload =
      dateÉchéance && typeGarantiesFinancières === `avec date d'échéance`
        ? {
            dateÉchéance: convertirEnDateTime(dateÉchéance).formatter(),
            typeGarantiesFinancières,
          }
        : dateÉchéance && !typeGarantiesFinancières
        ? { dateÉchéance: convertirEnDateTime(dateÉchéance).formatter() }
        : !dateÉchéance &&
          (typeGarantiesFinancières === `consignation` ||
            typeGarantiesFinancières === `6 mois après achèvement`)
        ? { typeGarantiesFinancières }
        : undefined;

    if (typePayload) {
      const legacyTypeEvent: TypeGarantiesFinancièresEnregistréSnapshotV1 = {
        type: 'TypeGarantiesFinancièresEnregistréSnapshot-v1',
        payload: {
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet).formatter(),
          ...typePayload,
        },
      };

      await publish(
        createGarantiesFinancièresAggregateId(convertirEnIdentifiantProjet(identifiantProjet)),
        legacyTypeEvent,
      );

      await sleep(100);
    }

    // ATTESTATION
    if (dateConstutition && format && contenuFichier) {
      const attestationEvent: AttestationGarantiesFinancièresEnregistréeEvent = {
        type: 'AttestationGarantiesFinancièresEnregistrée',
        payload: {
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet).formatter(),
          format: format,
          date: convertirEnDateTime(dateConstutition).formatter(),
        },
      };

      await publish(
        createGarantiesFinancièresAggregateId(convertirEnIdentifiantProjet(identifiantProjet)),
        attestationEvent,
      );

      const path = join(
        convertirEnIdentifiantProjet(identifiantProjet).formatter(),
        `attestation-constitution-garanties-Financieres.${extension(format)}`,
      );

      await upload(path, contenuFichier);
    }

    await sleep(500);
  },
);
