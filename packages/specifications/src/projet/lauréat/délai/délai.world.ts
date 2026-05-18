import { DateTime, Email } from '@potentiel-domain/common';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { AccorderDemandeDélaiFixture } from './fixtures/accorderDemandeDélai.fixture.js';
import { AnnulerDemandeDélaiFixture } from './fixtures/annulerDemandeDélai.fixture.js';
import { CorrigerDemandeDélaiFixture } from './fixtures/corrigerDélai.fixture.js';
import { DemanderDélaiFixture } from './fixtures/demanderDélai.fixture.js';
import { PasserEnInstructionDemandeDélaiFixture } from './fixtures/passerEnInstructionDemandeDélai.fixture.js';
import { RejeterDemandeDélaiFixture } from './fixtures/rejeterDemandeDélai.fixture.js';

export class DélaiWorld {
  readonly #demanderDélaiFixture: DemanderDélaiFixture = new DemanderDélaiFixture();

  get demanderDélaiFixture() {
    return this.#demanderDélaiFixture;
  }

  readonly #annulerDemandeDélaiFixture: AnnulerDemandeDélaiFixture =
    new AnnulerDemandeDélaiFixture();

  get annulerDélaiFixture() {
    return this.#annulerDemandeDélaiFixture;
  }

  readonly #passerEnInstructionDemandeDélaiFixture: PasserEnInstructionDemandeDélaiFixture =
    new PasserEnInstructionDemandeDélaiFixture();

  get passerEnInstructionDemandeDélaiFixture() {
    return this.#passerEnInstructionDemandeDélaiFixture;
  }

  readonly #rejeterDemandeDélaiFixture: RejeterDemandeDélaiFixture =
    new RejeterDemandeDélaiFixture();

  get rejeterDemandeDélaiFixture() {
    return this.#rejeterDemandeDélaiFixture;
  }

  readonly #accorderDemandeDélaiFixture: AccorderDemandeDélaiFixture =
    new AccorderDemandeDélaiFixture();

  get accorderDemandeDélaiFixture() {
    return this.#accorderDemandeDélaiFixture;
  }

  readonly #corrigerDemandeDélaiFixture: CorrigerDemandeDélaiFixture =
    new CorrigerDemandeDélaiFixture();

  get corrigerDemandeDélaiFixture() {
    return this.#corrigerDemandeDélaiFixture;
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
    statut: Lauréat.Délai.StatutDemandeDélai.ValueType,
  ): Lauréat.Délai.ConsulterDemandeDélaiReadModel {
    if (!this.#demanderDélaiFixture.aÉtéCréé) {
      throw new Error(`Aucune demande de délai n'a été créée dans DélaiWorld`);
    }

    const ao = appelsOffreData.find((x) => x.id === identifiantProjet.appelOffre);

    const expected: Lauréat.Délai.ConsulterDemandeDélaiReadModel = {
      statut,
      identifiantProjet,
      demandéLe: DateTime.convertirEnValueType(this.#demanderDélaiFixture.demandéLe),
      demandéPar: Email.convertirEnValueType(this.#demanderDélaiFixture.demandéPar),
      nombreDeMois: this.#demanderDélaiFixture.nombreDeMois,
      raison: this.#demanderDélaiFixture.raison,
      pièceJustificative: Lauréat.Délai.DocumentDélai.pièceJustificative({
        identifiantProjet: identifiantProjet.formatter(),
        demandéLe: this.#demanderDélaiFixture.demandéLe,
        pièceJustificative: { format: this.#demanderDélaiFixture.pièceJustificative.format },
      }),
      autoritéCompétente: Lauréat.Délai.AutoritéCompétente.convertirEnValueType(
        ao!.miseÀJour.changement === 'indisponible' || !ao?.miseÀJour.changement.délai.demande
          ? Lauréat.Délai.AutoritéCompétente.DEFAULT_AUTORITE_COMPETENTE_DELAI
          : ao.miseÀJour.changement.délai.autoritéCompétente,
      ),
      instruction: this.#passerEnInstructionDemandeDélaiFixture.aÉtéCréé
        ? {
            passéeEnInstructionLe: DateTime.convertirEnValueType(
              this.#passerEnInstructionDemandeDélaiFixture.passéeEnInstructionLe,
            ),
            passéeEnInstructionPar: Email.convertirEnValueType(
              this.#passerEnInstructionDemandeDélaiFixture.passéeEnInstructionPar,
            ),
          }
        : undefined,

      rejet: this.#rejeterDemandeDélaiFixture.aÉtéCréé
        ? {
            rejetéeLe: DateTime.convertirEnValueType(this.#rejeterDemandeDélaiFixture.rejetéeLe),
            rejetéePar: Email.convertirEnValueType(this.#rejeterDemandeDélaiFixture.rejetéePar),

            réponseSignée: Lauréat.Délai.DocumentDélai.demandeRejetée({
              identifiantProjet: identifiantProjet.formatter(),
              rejetéeLe: this.#rejeterDemandeDélaiFixture.rejetéeLe,
              réponseSignée: {
                format: this.#rejeterDemandeDélaiFixture.réponseSignée.format,
              },
            }),
          }
        : undefined,

      accord: this.#accorderDemandeDélaiFixture.aÉtéCréé
        ? {
            accordéeLe: DateTime.convertirEnValueType(this.#accorderDemandeDélaiFixture.accordéeLe),
            accordéePar: Email.convertirEnValueType(this.#accorderDemandeDélaiFixture.accordéePar),
            nombreDeMois: this.#demanderDélaiFixture.nombreDeMois,
            dateAchèvementPrévisionnelCalculée:
              Lauréat.Achèvement.DateAchèvementPrévisionnel.convertirEnValueType(
                this.#accorderDemandeDélaiFixture.dateAchèvementPrévisionnelActuelle,
              ).ajouterDélai(this.#demanderDélaiFixture.nombreDeMois).dateTime,
            réponseSignée: Lauréat.Délai.DocumentDélai.demandeAccordée({
              identifiantProjet: identifiantProjet.formatter(),
              accordéLe: this.#accorderDemandeDélaiFixture.accordéeLe,
              réponseSignée: {
                format: this.#accorderDemandeDélaiFixture.réponseSignée.format,
              },
            }),
          }
        : undefined,
    };

    if (this.corrigerDemandeDélaiFixture.aÉtéCréé) {
      expected.nombreDeMois = this.corrigerDemandeDélaiFixture.nombreDeMois;
      expected.raison = this.corrigerDemandeDélaiFixture.raison;
      expected.pièceJustificative = Lauréat.Délai.DocumentDélai.pièceJustificative({
        identifiantProjet: identifiantProjet.formatter(),
        demandéLe: this.#demanderDélaiFixture.demandéLe,
        pièceJustificative: this.#corrigerDemandeDélaiFixture.pièceJustificative
          ? {
              format: this.#corrigerDemandeDélaiFixture.pièceJustificative.format,
            }
          : { format: this.#demanderDélaiFixture.pièceJustificative.format },
      });
    }

    return expected;
  }
}
