import { DateTime, Email } from '@potentiel-domain/common';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { Lauréat } from '@potentiel-domain/projet';

import { type FieldToExempleMapper, mapNumber, mapToExemple } from '#helpers';
import type { LauréatWorld } from '../lauréat.world.js';
import { AccorderDemandeDélaiFixture } from './fixtures/accorderDemandeDélai.fixture.js';
import { AnnulerDemandeDélaiFixture } from './fixtures/annulerDemandeDélai.fixture.js';
import { CorrigerDemandeDélaiFixture } from './fixtures/corrigerDélai.fixture.js';
import {
  type CréerDemandeDélaiFixture,
  DemanderDélaiFixture,
} from './fixtures/demanderDélai.fixture.js';
import { PasserEnInstructionDemandeDélaiFixture } from './fixtures/passerEnInstructionDemandeDélai.fixture.js';
import { RejeterDemandeDélaiFixture } from './fixtures/rejeterDemandeDélai.fixture.js';

export class DélaiWorld {
  readonly #demanderDélaiFixture: DemanderDélaiFixture = new DemanderDélaiFixture();

  constructor(readonly lauréatWorld: LauréatWorld) {}

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
    statut: Lauréat.Délai.StatutDemandeDélai.ValueType,
    motifDemande?: string,
  ): Lauréat.Délai.ConsulterDemandeDélaiReadModel {
    if (!this.#demanderDélaiFixture.aÉtéCréé) {
      throw new Error(`Aucune demande de délai n'a été créée dans DélaiWorld`);
    }
    const identifiantProjet = this.lauréatWorld.identifiantProjet;

    const ao = appelsOffreData.find((x) => x.id === identifiantProjet.appelOffre);

    if (!ao) {
      throw new Error(`Appel d'offre non trouvée dans DélaiWorld`);
    }

    const demandes = this.#demanderDélaiFixture.demandes;
    const accord = this.#accorderDemandeDélaiFixture;

    const demande = accord.aÉtéCréé
      ? demandes.get(
          Lauréat.Délai.MotifDemandeDélai.convertirEnValueType(accord.ancienMotif).formatter(),
        )
      : motifDemande
        ? demandes.get(
            Lauréat.Délai.MotifDemandeDélai.convertirEnValueType(motifDemande).formatter(),
          )
        : demandes.values().next().value;

    if (!demande) {
      throw new Error(`Fixture demande non trouvée`);
    }

    const motif = Lauréat.Délai.MotifDemandeDélai.convertirEnValueType(
      accord?.motif ?? demande.motif,
    );

    const autoritéCompétente = this.lauréatWorld.cahierDesCharges.getAutoritéCompétente({
      domain: 'délai',
      motif: motif,
    });

    const expected: Lauréat.Délai.ConsulterDemandeDélaiReadModel = {
      statut,
      identifiantProjet,
      demandéLe: DateTime.convertirEnValueType(demande.demandéLe),
      demandéPar: Email.convertirEnValueType(demande.demandéPar),
      nombreDeMois: demande.nombreDeMois,
      raison: demande.raison,
      motif,
      pièceJustificative: Lauréat.Délai.DocumentDélai.pièceJustificative({
        identifiantProjet: identifiantProjet.formatter(),
        demandéLe: demande.demandéLe,
        pièceJustificative: { format: demande.pièceJustificative.format },
      }),
      autoritéCompétente: Lauréat.Délai.AutoritéCompétente.convertirEnValueType(autoritéCompétente),
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

      accord: accord.aÉtéCréé
        ? {
            accordéeLe: DateTime.convertirEnValueType(accord.accordéeLe),
            accordéePar: Email.convertirEnValueType(accord.accordéePar),
            nombreDeMois: demande.nombreDeMois,
            dateAchèvementPrévisionnelCalculée: motif.estProlongationPhaseEssai()
              ? Lauréat.Achèvement.DateAchèvementPrévisionnel.convertirEnValueType(
                  accord.dateAchèvementPrévisionnelActuelle,
                ).dateTime
              : Lauréat.Achèvement.DateAchèvementPrévisionnel.convertirEnValueType(
                  accord.dateAchèvementPrévisionnelActuelle,
                ).ajouterDélai(demande.nombreDeMois).dateTime,
            réponseSignée: Lauréat.Délai.DocumentDélai.demandeAccordée({
              identifiantProjet: identifiantProjet.formatter(),
              accordéLe: accord.accordéeLe,
              réponseSignée: {
                format: accord.réponseSignée.format,
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
        demandéLe: demande.demandéLe,
        pièceJustificative: this.#corrigerDemandeDélaiFixture.pièceJustificative
          ? {
              format: this.#corrigerDemandeDélaiFixture.pièceJustificative.format,
            }
          : { format: demande.pièceJustificative.format },
      });
    }

    return expected;
  }

  mapExempleToFixtureValues(exemple: Record<string, string>) {
    const délaiMap: FieldToExempleMapper<CréerDemandeDélaiFixture> = {
      motif: ['motif'],
      nombreDeMois: ['durée du délai demandé', mapNumber],
    };
    return mapToExemple(exemple, délaiMap);
  }
}
