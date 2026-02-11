import { describe, test } from 'node:test';

import '../../utils/zod/setupLocale';

import { assert, expect } from 'chai';

import { Candidature } from '@potentiel-domain/projet';

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

  describe('vérification des informations générales', () => {
    for (const champ of [
      'nomProjet',
      'sociétéMère',
      'nomCandidat',
      'nomReprésentantLégal',
      'emailContact',
    ]) {
      test(`erreur : champ ${champ} requis`, () => {
        const result = dépôtSchema.safeParse({
          ...minimumValues,
          [champ]: null,
        });

        assert(result.error);
        assertError(result, [champ], 'Le champ est requis');
      });
    }

    test('erreur : format email contact', () => {
      const result = dépôtSchema.safeParse({
        ...minimumValues,
        emailContact: 'test',
      });

      assert(result.error);
      assertError(result, ['emailContact'], 'adresse e-mail invalide');
    });

    test('erreur : puissance requise', () => {
      const result = dépôtSchema.safeParse({
        ...minimumValues,
        puissance: null,
      });

      assert(result.error);
      assertError(result, ['puissance'], 'Entrée invalide');
    });

    for (const champ of ['puissance', 'puissanceDeSite', 'puissanceProjetInitial']) {
      for (const valeur of ['mille', 0, -1]) {
        test(`erreur : valeur ${valeur} invalide pour le champ ${champ}`, () => {
          const result = dépôtSchema.safeParse({
            ...minimumValues,
            [champ]: valeur,
          });

          assert(result.error);
          assertError(result, [champ], 'Le champ doit être un nombre positif');
        });
      }
    }

    test('erreur : prix requis', () => {
      const result = dépôtSchema.safeParse({
        ...minimumValues,
        prixReference: null,
      });

      assert(result.error);
      assertError(result, ['prixReference'], 'Entrée invalide');
    });

    test('erreur : format prix', () => {
      const result = dépôtSchema.safeParse({
        ...minimumValues,
        prixReference: '10 euros',
      });

      assert(result.error);
      assertError(result, ['prixReference'], 'Le champ doit être un nombre positif');
    });

    test('erreur : format puissance à la pointe', () => {
      const result = dépôtSchema.safeParse({
        ...minimumValues,
        puissanceALaPointe: '1',
      });

      assert(result.error);
      assertError(result, ['puissanceALaPointe'], 'Entrée invalide');
    });

    for (const evaluationCarboneSimplifiée of ['true', '0', '-1', -1, 0]) {
      test('erreur : format evaluation carbone simplifiée', () => {
        const result = dépôtSchema.safeParse({
          ...minimumValues,
          evaluationCarboneSimplifiée,
        });

        assert(result.error);
        assertError(
          result,
          ['evaluationCarboneSimplifiée'],
          'Le champ doit être un nombre positif',
        );
      });
    }

    test('erreur : actionnariat invalide', () => {
      const result = dépôtSchema.safeParse({
        ...minimumValues,
        actionnariat: 'dgec',
      });

      assert(result.error);
      assertError(result, ['actionnariat'], 'Entrée invalide');
    });

    for (const actionnariat of Candidature.TypeActionnariat.types) {
      test(`type d'actionnariat ${actionnariat} valide`, () => {
        const result = dépôtSchema.safeParse({
          ...minimumValues,
          actionnariat,
        });

        assert(result.success);
      });
    }

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

    for (const technologie of Candidature.TypeTechnologie.types) {
      test(`type de technologie ${technologie} valide`, () => {
        const result = dépôtSchema.safeParse({
          ...minimumValues,
          technologie,
        });

        assert(result.success);
      });
    }

    test('erreur : historique abandon requis', () => {
      const result = dépôtSchema.safeParse({
        ...minimumValues,
        historiqueAbandon: null,
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

    for (const historiqueAbandon of Candidature.HistoriqueAbandon.types) {
      test(`historique abandon "${historiqueAbandon}" valide`, () => {
        const result = dépôtSchema.safeParse({
          ...minimumValues,
          historiqueAbandon,
        });

        assert(result.success);
      });
    }

    describe('localité', () => {
      test('erreur : localité invalide', () => {
        const result = dépôtSchema.safeParse({
          ...minimumValues,
          localité: 'boulodrome de Marseille',
        });

        assert(result.error);
        assertError(result, ['localité'], 'Entrée invalide : object attendu, string reçu');
      });

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
          localité: { ...minimumValues.localité, codePostal: null },
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
      assertError(result, ['typeGarantiesFinancières'], 'Entrée invalide');
    });

    for (const typeGarantiesFinancières of Candidature.TypeGarantiesFinancières.types) {
      test(`type de garanties financières ${typeGarantiesFinancières} valide`, () => {
        const result = dépôtSchema.safeParse({
          ...minimumValues,
          typeGarantiesFinancières,
        });

        assert(result.success);
      });
    }

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
      });
    });

    for (const champ of ['coefficientKChoisi', 'obligationDeSolarisation']) {
      for (const valeur of ['oui', 'non', true, false]) {
        test(`valeur ${valeur} valide pour le champ ${champ}`, () => {
          const result = dépôtSchema.safeParse({
            ...minimumValues,
            [champ]: valeur,
          });

          assert(result.success);
        });
      }
    }

    test("erreur : autorisation d'urbanisme", () => {
      const result = dépôtSchema.safeParse({
        ...minimumValues,
        autorisationDUrbanisme: 'avec',
      });

      assert(result.error);
      assertError(
        result,
        ['autorisationDUrbanisme'],
        'Entrée invalide : object attendu, string reçu',
      );
    });

    test('erreur : capacitéDuDispositifDeStockageEnKWh requis si installation avec dispositif de stockage', () => {
      const result = dépôtSchema.safeParse({
        ...minimumValues,
        dispositifDeStockage: {
          installationAvecDispositifDeStockage: true,
          puissanceDuDispositifDeStockageEnKW: 11,
        },
      });

      assert(result.error);
      assertError(
        result,
        ['dispositifDeStockage', 'capacitéDuDispositifDeStockageEnKWh'],
        '"capacitéDuDispositifDeStockageEnKWh" est requis lorsque "installationAvecDispositifDeStockage" est vrai',
      );
    });

    test('erreur : puissanceDuDispositifDeStockageEnKW requis si installation avec dispositif de stockage', () => {
      const result = dépôtSchema.safeParse({
        ...minimumValues,
        dispositifDeStockage: {
          installationAvecDispositifDeStockage: true,
          capacitéDuDispositifDeStockageEnKWh: 11,
        },
      });

      assert(result.error);
      assertError(
        result,
        ['dispositifDeStockage', 'puissanceDuDispositifDeStockageEnKW'],
        '"puissanceDuDispositifDeStockageEnKW" est requis lorsque "installationAvecDispositifDeStockage" est vrai',
      );
    });

    test('erreur : taux ACI requis', () => {
      const result = dépôtSchema.safeParse({
        ...minimumValues,
        natureDeLExploitation: { typeNatureDeLExploitation: 'vente-avec-injection-du-surplus' },
        tauxPrévisionnelACI: null,
      });

      assert(result.error);
      assertError(
        result,
        ['natureDeLExploitation', 'tauxPrévisionnelACI'],
        '"tauxPrévisionnelACI" est requis lorsque "typeNatureDeLExploitation" a la valeur "vente-avec-injection-du-surplus"',
      );
    });

    test('erreur : typologie installation invalide', () => {
      const result = dépôtSchema.safeParse({
        ...minimumValues,
        typologieInstallation: 'batiment',
      });

      assert(result.error);
      assertError(
        result,
        ['typologieInstallation'],
        'Entrée invalide : array attendu, string reçu',
      );
    });

    for (const typologie of Candidature.TypologieInstallation.typologies) {
      test(`typologie installation "${typologie}" valide`, () => {
        const result = dépôtSchema.safeParse({
          ...minimumValues,
          typologieInstallation: [{ typologie }],
        });

        assert(result.success);
      });
    }
  });
});
