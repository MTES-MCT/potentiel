import { When as Quand, DataTable } from '@cucumber/cucumber';
import { PotentielWorld } from '../../../potentiel.world';
import {
  AttestationGarantiesFinancièresEnregistréeEvent,
  DomainUseCase,
  TypeGarantiesFinancières,
  TypeGarantiesFinancièresEnregistréEventV0,
  Utilisateur,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
  createProjetAggregateId,
} from '@potentiel/domain';
import { mediator } from 'mediateur';
import { sleep } from '../../../helpers/sleep';
import { convertStringToReadable } from '../../../helpers/convertStringToReadable';
import { upload } from '@potentiel/file-storage';
import { publish } from '@potentiel/pg-event-sourcing';
import { extension } from 'mime-types';
import { join } from 'path';

Quand(
  `un utilisateur avec le rôle {string} enregistre (le type et la date d'échéance )(l'attestation )des garanties financières (complètes )pour le projet {string} avec :`,
  async function (this: PotentielWorld, rôle: string, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();

    try {
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
  `un développeur migre des garanties financières legacy pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();

    try {
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
        const legacyTypeEvent: TypeGarantiesFinancièresEnregistréEventV0 = {
          type: 'TypeGarantiesFinancièresEnregistré-v0',
          payload: {
            identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet).formatter(),
            ...typePayload,
          },
        };

        await publish(
          createProjetAggregateId(convertirEnIdentifiantProjet(identifiantProjet)),
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
          createProjetAggregateId(convertirEnIdentifiantProjet(identifiantProjet)),
          attestationEvent,
        );

        const path = join(
          convertirEnIdentifiantProjet(identifiantProjet).formatter(),
          `attestation-constitution-garanties-financieres.${extension(format)}`,
        );

        await upload(path, contenuFichier);
      }

      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);
