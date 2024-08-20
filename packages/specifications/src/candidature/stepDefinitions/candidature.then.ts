import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert, expect } from 'chai';
import waitForExpect from 'wait-for-expect';

import { Candidature } from '@potentiel-domain/candidature';
import { Option } from '@potentiel-libraries/monads';
import { DateTime, StatutProjet } from '@potentiel-domain/common';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { mapToPlainObject } from '@potentiel-domain/core';

import { PotentielWorld } from '../../potentiel.world';

import { mapExampleToUseCaseDefaultValues } from './helper';

Alors(
  'la candidature {string} devrait être consultable dans la liste des candidatures avec :',
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();
    const { values: expectedValues } = mapExampleToUseCaseDefaultValues(nomProjet, exemple);
    const { identifiantProjet } = this.candidatureWorld.rechercherCandidatureFixture(nomProjet);

    await waitForExpect(async () => {
      const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
        type: 'Candidature.Query.ConsulterCandidature',
        data: { identifiantProjet: identifiantProjet.formatter() },
      });

      assert(Option.isSome(candidature), 'Candidature non trouvée');

      // Comparaison des clés retournées, afin de vérifier qu'il n'en manque pas, ou qu'il n'y en a pas trop.
      // Cette étape est dûe à la manipulation avec mapToPlainObject ci-dessous, qui retire les champs avec valeur undefined.
      // on ajoute les champs manquants attendus d'un coté ou de l'autre.
      expect(
        Object.keys(candidature)
          .concat('appelOffre', 'période', 'famille', 'numéroCRE', 'détails')
          .sort(),
      ).to.deep.eq(
        Object.keys(expectedValues)
          .concat('identifiantProjet', 'misÀJourLe')
          .map((key) => key.replace(/Value$/, ''))
          .sort(),
      );

      // Comparaion de l'objet retourné
      // mapToPlainObject est utilisé afin de comparer les value type, mais cela retire les champs avec valeur undefined.
      expect(mapToPlainObject(candidature)).to.deep.eq(
        mapToPlainObject({
          localité: expectedValues.localitéValue,
          dateÉchéanceGf: expectedValues.dateÉchéanceGfValue
            ? DateTime.convertirEnValueType(expectedValues.dateÉchéanceGfValue)
            : undefined,
          emailContact: expectedValues.emailContactValue,
          evaluationCarboneSimplifiée: expectedValues.evaluationCarboneSimplifiéeValue,
          financementCollectif: expectedValues.financementCollectifValue,
          financementParticipatif: expectedValues.financementParticipatifValue,
          gouvernancePartagée: expectedValues.gouvernancePartagéeValue,
          historiqueAbandon: Candidature.HistoriqueAbandon.convertirEnValueType(
            expectedValues.historiqueAbandonValue,
          ),
          identifiantProjet,
          motifÉlimination: expectedValues.motifÉliminationValue,
          nomCandidat: expectedValues.nomCandidatValue,
          nomProjet: expectedValues.nomProjetValue,
          nomReprésentantLégal: expectedValues.nomReprésentantLégalValue,
          noteTotale: expectedValues.noteTotaleValue,
          prixReference: expectedValues.prixReferenceValue,
          puissanceALaPointe: expectedValues.puissanceALaPointeValue,
          puissanceProductionAnnuelle: expectedValues.puissanceProductionAnnuelleValue,
          sociétéMère: expectedValues.sociétéMèreValue,
          statut: StatutProjet.convertirEnValueType(expectedValues.statutValue),
          technologie: Candidature.Technologie.convertirEnValueType(
            expectedValues.technologieValue,
          ),
          territoireProjet: expectedValues.territoireProjetValue,
          typeGarantiesFinancières: expectedValues.typeGarantiesFinancièresValue
            ? GarantiesFinancières.TypeGarantiesFinancières.convertirEnValueType(
                expectedValues.typeGarantiesFinancièresValue,
              )
            : undefined,
          valeurÉvaluationCarbone: expectedValues.evaluationCarboneSimplifiéeValue,

          misÀJourLe: DateTime.convertirEnValueType(new Date('2024-08-20')),
        } satisfies Candidature.ConsulterCandidatureReadModel),
      );
    });
  },
);
