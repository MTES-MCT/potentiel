import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';

import { Candidature, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';

import { PotentielWorld } from '../../potentiel.world';
import { DeepPartial } from '../../fixture';

EtantDonné(
  `la candidature lauréate legacy {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, datatable: DataTable) {
    const exemple = datatable.rowsHash();
    await importerCandidaturePériodeLegacy.call(
      this,
      nomProjet,
      'classé',
      this.candidatureWorld.mapExempleToFixtureValues(exemple),
    );
  },
);

EtantDonné(
  `la candidature éliminée legacy {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, datatable: DataTable) {
    const exemple = datatable.rowsHash();
    await importerCandidaturePériodeLegacy.call(
      this,
      nomProjet,
      'éliminé',
      this.candidatureWorld.mapExempleToFixtureValues(exemple),
    );
  },
);

export async function importerCandidaturePériodeLegacy(
  this: PotentielWorld,
  nomProjet: string,
  statut: Candidature.StatutCandidature.RawType,
  partialValues?: DeepPartial<Candidature.ImporterCandidatureUseCase['data']>,
) {
  const { values } = this.candidatureWorld.importerCandidature.créer({
    values: {
      ...partialValues,
      statutValue: statut,
      nomProjetValue: nomProjet,
      importéPar: this.utilisateurWorld.validateurFixture.email,
    },
  });

  const identifiantProjet = IdentifiantProjet.convertirEnValueType(
    `${values.appelOffreValue}#${values.périodeValue}#${values.familleValue}#${values.numéroCREValue}`,
  ).formatter();

  const event: Candidature.CandidatureImportéeEvent = {
    type: 'CandidatureImportée-V2',
    payload: {
      identifiantProjet,
      importéLe: DateTime.convertirEnValueType(values.importéLe).formatter(),
      importéPar: values.importéPar,
      nomProjet: values.nomProjetValue,
      nomCandidat: values.nomCandidatValue,
      nomReprésentantLégal: values.nomReprésentantLégalValue,
      actionnariat: values.actionnariatValue
        ? Candidature.TypeActionnariat.convertirEnValueType(values.actionnariatValue).formatter()
        : undefined,
      emailContact: values.emailContactValue,
      evaluationCarboneSimplifiée: values.evaluationCarboneSimplifiéeValue,
      historiqueAbandon: Candidature.HistoriqueAbandon.convertirEnValueType(
        values.historiqueAbandonValue,
      ).formatter(),
      localité: values.localitéValue,
      noteTotale: values.noteTotaleValue,
      prixReference: values.prixRéférenceValue,
      puissanceALaPointe: values.puissanceALaPointeValue,
      puissanceProductionAnnuelle: values.puissanceProductionAnnuelleValue,
      sociétéMère: values.sociétéMèreValue,
      statut: Candidature.StatutCandidature.convertirEnValueType(values.statutValue).formatter(),
      technologie: Candidature.TypeTechnologie.convertirEnValueType(
        values.technologieValue,
      ).formatter(),
      territoireProjet: values.territoireProjetValue,
      coefficientKChoisi: values.coefficientKChoisiValue,
      dateÉchéanceGf: values.dateÉchéanceGfValue
        ? DateTime.convertirEnValueType(values.dateÉchéanceGfValue).formatter()
        : undefined,
      motifÉlimination: values.motifÉliminationValue,
      typeGarantiesFinancières: values.typeGarantiesFinancièresValue
        ? Candidature.TypeGarantiesFinancières.convertirEnValueType(
            values.typeGarantiesFinancièresValue,
          ).type
        : undefined,
      fournisseurs: values.fournisseursValue
        .map(Lauréat.Fournisseur.Fournisseur.convertirEnValueType)
        .map((fournisseur) => fournisseur.formatter()),
    },
  };

  await publish(`candidature|${identifiantProjet}`, event);
}
