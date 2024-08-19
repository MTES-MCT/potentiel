import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { expect } from 'chai';
import waitForExpect from 'wait-for-expect';

import { Candidature } from '@potentiel-domain/candidature';
import { DateTime, StatutProjet } from '@potentiel-domain/common';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { ConsulterDocumentProjetQuery, DocumentProjet } from '@potentiel-domain/document';

import { PotentielWorld } from '../../potentiel.world';
import { convertReadableStreamToString } from '../../helpers/convertReadableToString';

import { mapExampleToUseCaseDefaultValues } from './helper';

Alors(
  `la candidature {string} devrait être consultable avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();
    const { values: expectedValues } = mapExampleToUseCaseDefaultValues(nomProjet, exemple);
    const { identifiantProjet } = this.candidatureWorld.rechercherCandidatureFixture(nomProjet);

    await waitForExpect(async () => {
      const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
        type: 'Candidature.Query.ConsulterCandidature',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      expect(Option.isSome(candidature)).to.be.true;

      // Comparaison des clés retournées, afin de vérifier qu'il n'en manque pas, ou qu'il n'y en a pas trop.
      // Cette étape est dûe à la manipulation avec mapToPlainObject ci-dessous, qui retire les champs avec valeur undefined.
      // on ajoute les champs manquants attendus d'un coté ou de l'autre.
      expect(
        Object.keys(candidature).concat('appelOffre', 'période', 'famille', 'numéroCRE').sort(),
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
          détails: DocumentProjet.convertirEnValueType(
            identifiantProjet.formatter(),
            'candidature/import',
            new Date('2024-08-20').toISOString(),
            'application/json',
          ),
        } satisfies Candidature.ConsulterCandidatureReadModel),
      );

      if (Option.isSome(candidature)) {
        const result = await mediator.send<ConsulterDocumentProjetQuery>({
          type: 'Document.Query.ConsulterDocumentProjet',
          data: {
            documentKey: candidature.détails.formatter(),
          },
        });

        const actualContent = await convertReadableStreamToString(result.content);
        expect(actualContent).to.equal(JSON.stringify(expectedValues.détailsValue));
      }
    });
  },
);

Alors(
  'la candidature {string} devrait être consultable dans la liste des candidatures avec :',
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();
    const { values: expectedValues } = mapExampleToUseCaseDefaultValues(nomProjet, exemple);
    const { identifiantProjet } = this.candidatureWorld.rechercherCandidatureFixture(nomProjet);

    await waitForExpect(async () => {
      const { items: candidatures } = await mediator.send<Candidature.ListerCandidaturesQuery>({
        type: 'Candidature.Query.ListerCandidatures',
        data: {
          nomProjet,
        },
      });
      expect(candidatures).to.have.lengthOf(1);

      const [candidature] = candidatures;

      const {
        statutValue,
        nomProjetValue,
        nomCandidatValue,
        nomReprésentantLégalValue,
        emailContactValue,
        puissanceProductionAnnuelleValue,
        prixReferenceValue,
        evaluationCarboneSimplifiéeValue,
        localitéValue: { commune, département, région },
        détailsValue,
      } = mapExampleToUseCaseDefaultValues(nomProjet, exemple).values;

      // Comparaison des clés retournées, afin de vérifier qu'il n'en manque pas, ou qu'il n'y en a pas trop.
      // Cette étape est dûe à la manipulation avec mapToPlainObject ci-dessous, qui retire les champs avec valeur undefined.
      // on ajoute les champs manquants attendus d'un coté ou de l'autre.
      expect(Object.keys(candidature).sort()).to.deep.eq(
        Object.keys({
          statutValue,
          nomProjetValue,
          nomCandidatValue,
          nomReprésentantLégalValue,
          emailContactValue,
          puissanceProductionAnnuelleValue,
          prixReferenceValue,
          evaluationCarboneSimplifiéeValue,
          localitéValue: {
            commune,
            département,
            région,
          },
          détailsValue,
        })
          .concat('identifiantProjet')
          .map((key) => key.replace(/Value$/, ''))
          .sort(),
      );

      // Comparaion de l'objet retourné
      // mapToPlainObject est utilisé afin de comparer les value type, mais cela retire les champs avec valeur undefined.
      expect(mapToPlainObject(candidature)).to.deep.eq(
        mapToPlainObject({
          statut: StatutProjet.convertirEnValueType(expectedValues.statutValue),
          nomProjet: expectedValues.nomProjetValue,
          nomCandidat: expectedValues.nomCandidatValue,
          nomReprésentantLégal: expectedValues.nomReprésentantLégalValue,
          emailContact: expectedValues.emailContactValue,
          puissanceProductionAnnuelle: expectedValues.puissanceProductionAnnuelleValue,
          prixReference: expectedValues.prixReferenceValue,
          evaluationCarboneSimplifiée: expectedValues.evaluationCarboneSimplifiéeValue,
          localité: {
            commune: expectedValues.localitéValue.commune,
            département: expectedValues.localitéValue.département,
            région: expectedValues.localitéValue.région,
          },
          identifiantProjet,
          détails: DocumentProjet.convertirEnValueType(
            identifiantProjet.formatter(),
            'candidature/import',
            new Date('2024-08-20').toISOString(),
            'application/json',
          ),
        } satisfies Candidature.ListerCandidaturesReadModel['items'][number]),
      );

      const result = await mediator.send<ConsulterDocumentProjetQuery>({
        type: 'Document.Query.ConsulterDocumentProjet',
        data: {
          documentKey: candidature.détails.formatter(),
        },
      });

      const actualContent = await convertReadableStreamToString(result.content);
      expect(actualContent).to.equal(JSON.stringify(expectedValues.détailsValue));
    });
  },
);

Alors(
  'la candidature {string} ne devrait plus être consultable dans la liste des candidatures',
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.candidatureWorld.rechercherCandidatureFixture(nomProjet);

    await waitForExpect(async () => {
      const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
        type: 'Candidature.Query.ConsulterCandidature',
        data: { identifiantProjet: identifiantProjet.formatter() },
      });

      assert(Option.isNone(candidature));
    });
  },
);

Alors(
  'le projet {string} devrait être consultable dans la liste des projets lauréats',
  function (this: PotentielWorld, _nomProjet: string) {},
);
