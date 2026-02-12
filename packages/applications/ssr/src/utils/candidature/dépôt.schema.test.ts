import { describe, test } from 'node:test';

import '../../utils/zod/setupLocale';

import { assert, expect } from 'chai';

import { dépôtSchema } from './dépôt.schema';
import { assertError, deepEqualWithRichDiff } from './csv/_test-shared';

const minimumValues = {
  nomProjet: 'Nom du projet',
  sociétéMère: 'Société Mère',
  nomCandidat: 'le candidat',
  puissance: '100',
  prixReference: '5',
  emailContact: 'porteur@test.test',
  nomReprésentantLégal: 'représentant légal',
  localité: {
    adresse1: 'adresse1',
    adresse2: 'adresse2',
    codePostal: '75001',
    commune: 'Paris',
    département: '75',
    région: 'Île-de-France',
  },
  puissanceALaPointe: 'true',
  evaluationCarboneSimplifiée: '100',
  actionnariat: 'gouvernance-partagée',
  historiqueAbandon: 'première-candidature',
  technologie: 'eolien',
  typeGarantiesFinancières: 'avec-date-échéance',
  dateÉchéanceGf: '01/01/2025',
  dateConstitutionGf: '01/01/2024',
  typologieInstallation: [],
};

const expectedMinimumValues = {
  ...minimumValues,
  puissance: 100,
  prixReference: 5,
  puissanceALaPointe: true,
  evaluationCarboneSimplifiée: 100,
  dateÉchéanceGf: new Date(minimumValues.dateÉchéanceGf).toISOString(),
  dateConstitutionGf: new Date(minimumValues.dateConstitutionGf).toISOString(),
};

describe('Schéma dépôt', () => {
  test('cas nominal', () => {
    const result = dépôtSchema.safeParse(minimumValues);

    assert(result.success);
    deepEqualWithRichDiff(result.data, expectedMinimumValues);
  });

  describe('erreurs courantes', () => {
    for (const champ of ['nomProjet', 'nomCandidat', 'nomReprésentantLégal', 'emailContact']) {
      test(`champ string ${champ} requis`, () => {
        const result = dépôtSchema.safeParse({
          ...minimumValues,
          [champ]: undefined,
        });

        assert(result.error);
        assertError(result, [champ], 'Le champ est requis');
      });
    }

    test('format email', () => {
      const result = dépôtSchema.safeParse({
        ...minimumValues,
        emailContact: 'test',
      });

      assert(result.error);
      assertError(result, ['emailContact'], 'adresse e-mail invalide');
    });

    for (const champ of [
      'puissance',
      'puissanceDeSite',
      'puissanceProjetInitial',
      'prixReference',
      'evaluationCarboneSimplifiée',
    ]) {
      for (const valeur of [0, -1]) {
        test(`${champ} doit être un nombre positif`, () => {
          const result = dépôtSchema.safeParse({
            ...minimumValues,
            [champ]: valeur,
          });

          assert(result.error);
          assertError(result, [champ], 'Le champ doit être un nombre positif');
        });
      }
    }

    for (const champ of ['puissance', 'prixReference', 'evaluationCarboneSimplifiée']) {
      for (const valeur of ['dix', undefined]) {
        test(`${champ} doit être un nombre)`, () => {
          const result = dépôtSchema.safeParse({
            ...minimumValues,
            [champ]: valeur,
          });

          assert(result.error);
          assertError(result, [champ], 'Le champ doit être un nombre');
        });
      }
    }

    test('actionnariat invalide', () => {
      const result = dépôtSchema.safeParse({
        ...minimumValues,
        actionnariat: 'dgec',
      });

      assert(result.error);
      assertError(
        result,
        ['actionnariat'],
        'Option invalide : une valeur parmi "financement-collectif"|"gouvernance-partagée"|"financement-participatif"|"investissement-participatif" attendue',
      );
    });

    test('erreur : technologie invalide', () => {
      const result = dépôtSchema.safeParse({
        ...minimumValues,
        technologie: 'photovoltaïque',
      });

      assert(result.error);
      assertError(
        result,
        ['technologie'],
        'Option invalide : une valeur parmi "pv"|"eolien"|"hydraulique"|"N/A" attendue',
      );
    });

    test('erreur : historique abandon requis', () => {
      const result = dépôtSchema.safeParse({
        ...minimumValues,
        historiqueAbandon: undefined,
      });

      assert(result.error);
      assertError(
        result,
        ['historiqueAbandon'],
        'Option invalide : une valeur parmi "première-candidature"|"abandon-classique"|"abandon-avec-recandidature"|"lauréat-autre-période" attendue',
      );
    });

    test('erreur : historique abandon invalide', () => {
      const result = dépôtSchema.safeParse({
        ...minimumValues,
        historiqueAbandon: 'nouvelle candidature',
      });

      assert(result.error);
      assertError(
        result,
        ['historiqueAbandon'],
        'Option invalide : une valeur parmi "première-candidature"|"abandon-classique"|"abandon-avec-recandidature"|"lauréat-autre-période" attendue',
      );
    });

    describe('localité', () => {
      test("n'accepte pas un code postal invalide", () => {
        const result = dépôtSchema.safeParse({
          ...minimumValues,
          localité: { ...minimumValues.localité, codePostal: 'invalide' },
        });

        assert(result.error);
        assertError(
          result,
          ['localité', 'codePostal'],
          'Le code postal ne correspond à aucune région / département',
        );
      });

      test("n'accepte pas un code postal vide", () => {
        const result = dépôtSchema.safeParse({
          ...minimumValues,
          localité: { ...minimumValues.localité, codePostal: undefined },
        });

        assert(result.error);
        assertError(result, ['localité', 'codePostal'], 'Le champ est requis');
      });

      test("n'accepte pas un code postal inexistant", () => {
        const result = dépôtSchema.safeParse({
          ...minimumValues,
          localité: { ...minimumValues.localité, codePostal: '99999999' },
        });

        assert(result.error);
        assertError(
          result,
          ['localité', 'codePostal'],
          'Le code postal ne correspond à aucune région / département',
        );
      });

      test("plusieurs codes postaux séparés par des '/' sont acceptés", () => {
        const result = dépôtSchema.safeParse({
          ...minimumValues,
          localité: { ...minimumValues.localité, codePostal: '33100 / 75001 / 13001' },
        });

        assert(result.success);
        expect(result.data.localité.codePostal).to.deep.equal('33100 / 75001 / 13001');
      });

      test('si le CP fait moins de 5 caractères, il est complété par des 0 à gauche (transformation MS Excel)', () => {
        const result = dépôtSchema.safeParse({
          ...minimumValues,
          localité: { ...minimumValues.localité, codePostal: '3340' },
        });
        assert(result.success);
        expect(result.data.localité.codePostal).to.deep.equal('03340');
      });
    });
  });

  describe('garanties financières', () => {
    test('erreur : type invalide', () => {
      const result = dépôtSchema.safeParse({
        ...minimumValues,
        typeGarantiesFinancières: 'avec date de fin',
      });

      assert(result.error);
      assertError(
        result,
        ['typeGarantiesFinancières'],
        'Option invalide : une valeur parmi "consignation"|"avec-date-échéance"|"six-mois-après-achèvement"|"type-inconnu"|"exemption" attendue',
      );
    });

    test('erreur : date échéance manquante', () => {
      const result = dépôtSchema.safeParse({
        ...minimumValues,
        typeGarantiesFinancières: 'avec-date-échéance',
        dateÉchéanceGf: undefined,
      });

      assert(result.error);
      assertError(
        result,
        ['dateÉchéanceGf'],
        '"dateÉchéanceGf" est requis lorsque "typeGarantiesFinancières" a la valeur "avec-date-échéance"',
      );
    });
  });

  describe('champs supplémentaires', () => {
    test('cas nominal', () => {
      const champsSupplémentaires = {
        installateur: 'Installateur.Inc',
        coefficientKChoisi: 'true',
        autorisationDUrbanisme: { numéro: 'URB-01', date: '12/12/2022' },
        puissanceDeSite: '200',
        natureDeLExploitation: { typeNatureDeLExploitation: 'vente-avec-injection-en-totalité' },
        dispositifDeStockage: {
          installationAvecDispositifDeStockage: true,
          capacitéDuDispositifDeStockageEnKWh: 1,
          puissanceDuDispositifDeStockageEnKW: 1,
        },
        puissanceProjetInitial: '100',
        obligationDeSolarisation: 'true',
      };

      const result = dépôtSchema.safeParse({
        ...minimumValues,
        ...champsSupplémentaires,
      });

      assert(result.success);
      deepEqualWithRichDiff(result.data, {
        ...expectedMinimumValues,
        ...champsSupplémentaires,
        coefficientKChoisi: true,
        puissanceDeSite: 200,
        puissanceProjetInitial: 100,
        autorisationDUrbanisme: {
          numéro: 'URB-01',
          date: new Date(champsSupplémentaires.autorisationDUrbanisme.date).toISOString(),
        },
        obligationDeSolarisation: true,
      });
    });

    for (const champ of ['coefficientKChoisi', 'obligationDeSolarisation', 'puissanceALaPointe']) {
      test(`bouléen attendu pour ${champ}`, () => {
        const result = dépôtSchema.safeParse({
          ...minimumValues,
          [champ]: 'avec',
        });

        assert(result.error);
        assertError(result, [champ], 'La valeur doit être un booléen ou "oui" / "non"');
      });
    }

    test('capacitéDuDispositifDeStockageEnKWh et puissanceDuDispositifDeStockageEnKW requis si installation avec dispositif de stockage', () => {
      const result = dépôtSchema.safeParse({
        ...minimumValues,
        dispositifDeStockage: {
          installationAvecDispositifDeStockage: true,
        },
      });

      assert(result.error);
      assertError(
        result,
        [
          'dispositifDeStockage',
          'capacitéDuDispositifDeStockageEnKWh',
          'puissanceDuDispositifDeStockageEnKW',
        ],
        `"capacitéDuDispositifDeStockageEnKWh" et "puissanceDuDispositifDeStockageEnKW" sont requis lorsque l'installation est avec dispositif de stockage`,
      );
    });

    test('erreur : taux ACI requis', () => {
      const result = dépôtSchema.safeParse({
        ...minimumValues,
        natureDeLExploitation: { typeNatureDeLExploitation: 'vente-avec-injection-du-surplus' },
        tauxPrévisionnelACI: undefined,
      });

      assert(result.error);
      assertError(
        result,
        ['natureDeLExploitation', 'tauxPrévisionnelACI'],
        `"tauxPrévisionnelACI" est requis lorsque le type de la nature de l'exploitation est avec injection du surplus`,
      );
    });
  });
});
