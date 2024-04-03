import { describe, expect, it } from '@jest/globals';
import moment from 'moment';
import { parseProjectLine } from './parseProjectLine';

const fakeLine = {
  "Appel d'offres": 'appelOffreId',
  Période: 'periodeId',
  Famille: 'familleId',
  'Nom (personne physique) ou raison sociale (personne morale) :': 'nomCandidat',
  Candidat: '',
  'Nom projet': 'nomProjet',
  'Société mère': 'actionnaire',
  'N°CRE': 'numeroCRE',
  puissance: '1.234',
  prixReference: '3.456',
  'Note totale': '10.10',
  'Nom et prénom du représentant légal': 'nomRepresentantLegal',
  'Adresse électronique du contact': 'test@test.test',
  'N°, voie, lieu-dit': 'adresseProjet',
  'N°, voie, lieu-dit 1': '',
  'N°, voie, lieu-dit 2': '',
  CP: '69100 / 01390',
  Commune: 'communeProjet',
  'Classé ?': 'Classé',
  'Engagement de fourniture de puissance à la pointe\n(AO ZNI)': '',
  'Territoire\n(AO ZNI)': '',
  'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
    '230.50',
  'Valeur de l’évaluation carbone des modules (kg eq CO2/kWc)': '',
  Autre: 'valeur',
  'Gouvernance partagée (Oui/Non)': 'Non',
  'Financement collectif (Oui/Non)': 'Non',
  "1. 1ère candidature\n2. Abandon classique\n3. Abandon avec recandidature\n4. Lauréat d'une autre période":
    '1',
};

const expected = {
  appelOffreId: 'appelOffreId',
  periodeId: 'periodeId',
  familleId: 'familleId',
  numeroCRE: 'numeroCRE',
  nomCandidat: 'nomCandidat',
  nomProjet: 'nomProjet',
  actionnaire: 'actionnaire',
  puissance: 1.234,
  prixReference: 3.456,
  note: 10.1,
  nomRepresentantLegal: 'nomRepresentantLegal',
  email: 'test@test.test',
  adresseProjet: 'adresseProjet',
  codePostalProjet: '69100 / 01390',
  departementProjet: 'Rhône / Ain',
  regionProjet: 'Auvergne-Rhône-Alpes',
  communeProjet: 'communeProjet',
  classe: 'Classé',
  isInvestissementParticipatif: false,
  isFinancementParticipatif: false,
  engagementFournitureDePuissanceAlaPointe: false,
  territoireProjet: '',
  evaluationCarbone: 230.5,
  technologie: 'N/A',
  actionnariat: undefined,
  details: {
    Autre: 'valeur',
  },
  historiqueAbandon: 'première-candidature',
};

describe('parseProjectLine', () => {
  describe(`Cas général`, () => {
    it('Les données du projet doivent être retournées au format attendu', () => {
      const project = parseProjectLine(fakeLine);

      expect(project).toMatchObject(expected);
    });
  });
  describe("Appel d'offres (obligatoire)", () => {
    it(`Lorsque l'appel d'offres est manquant
        Alors une erreur devrait être retournée`, () => {
      expect(() => parseProjectLine({ ...fakeLine, "Appel d'offres": '' })).toThrowError(
        "Appel d'offres manquant",
      );
    });
  });
  describe('Période (obligatoire)', () => {
    it(`Lorsque la période est manquante
        Alors une erreur devrait être retournée`, () => {
      expect(() => parseProjectLine({ ...fakeLine, Période: '' })).toThrowError(
        'Période manquante',
      );
    });
  });
  describe('Numéro CRE (obligatoire)', () => {
    it(`Lorsque le numéro CRE est manquant
        Alors une erreur devrait être retournée`, () => {
      expect(() => parseProjectLine({ ...fakeLine, 'N°CRE': '' })).toThrowError('N°CRE manquant');
    });
  });
  describe('Nom du candidat (obligatoire)', () => {
    it(`Lorsque le nom du candidat est manquant
        Alors une erreur devrait être retournée`, () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Nom (personne physique) ou raison sociale (personne morale) :': '',
          Candidat: '',
        }),
      ).toThrowError('Candidat manquant');
    });
  });
  describe(`Adresse du projet (obligatoire)`, () => {
    it(`Les colonnes "N°, voie, lieu-dit" devraient être affectée à la propriété "adresseProjet"`, () => {
      expect(
        parseProjectLine({
          ...fakeLine,
          'N°, voie, lieu-dit': 'adresseProjet',
        }),
      ).toMatchObject({ adresseProjet: 'adresseProjet' });

      expect(
        parseProjectLine({
          ...fakeLine,
          'N°, voie, lieu-dit 1': 'adresseProjetPart1',
          'N°, voie, lieu-dit 2': 'adresseProjetPart2',
        }),
      ).toMatchObject({ adresseProjet: 'adresseProjetPart1\nadresseProjetPart2' });

      expect(
        parseProjectLine({
          ...fakeLine,
          'N°, voie, lieu-dit 1': 'adresseProjetPart1',
          'N°, voie, lieu-dit 2': '',
        }),
      ).toMatchObject({ adresseProjet: 'adresseProjetPart1' });

      expect(
        parseProjectLine({
          ...fakeLine,
          'N°, voie, lieu-dit 1': '',
          'N°, voie, lieu-dit 2': 'adresseProjetPart2',
        }),
      ).toMatchObject({ adresseProjet: 'adresseProjetPart2' });
    });

    it(`Les colonnes "N°, voie, lieu-dit" doivent être complétées`, () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'N°, voie, lieu-dit': '',
          'N°, voie, lieu-dit 1': '',
          'N°, voie, lieu-dit 2': '',
        }),
      ).toThrowError(
        `L'adresse du projet est manquante : vous devez compléter au moins l'une des colonnes "N°, voie, lieu-dit"`,
      );
    });
  });
  describe(`Code postal du projet (obligatoire)`, () => {
    it(`Lorsque le code postal est manquant
        Alors une erreur devrait être retournée`, () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          CP: '',
        }),
      ).toThrowError(`Code Postal manquant`);
    });

    it(`Lorsque le code postal est mal formaté
        Alors une erreur devrait être retournée`, () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          CP: 'not a code postal',
        }),
      ).toThrowError(`Code Postal mal formé`);

      expect(() =>
        parseProjectLine({
          ...fakeLine,
          CP: '69100 / non',
        }),
      ).toThrowError(`Code Postal mal formé`);
    });

    it(`Lorsque le code postal ne correspond pas à un département (ou région)
        Alors une erreur devrait être retournée`, () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          CP: '96000',
        }),
      ).toThrowError(`Le Code Postal ne correspond à aucun département`);
    });

    it(`Les codes postaux à 4 chiffres sont acceptés`, () => {
      expect(
        parseProjectLine({
          ...fakeLine,
          CP: '1390',
        }),
      ).toMatchObject({ codePostalProjet: '01390' });
    });
  });
  describe(`Prix de référence (obligatoire)`, () => {
    it(`Lorsque le prix est manquant
        Alors une erreur devrait être retournée`, () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          prixReference: '',
        }),
      ).toThrowError('Le Prix doit être un nombre');
    });

    it(`Lorsque le prix est une valeur négative
        Alors une erreur devrait être retournée`, () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          prixReference: '-32',
        }),
      ).toThrowError('Le champ Prix doit être strictement positif');
    });

    describe(`Cas d'un prix égal à 0`, () => {
      it(`Etant donné un appel d'offre ID contenant "autoconsommation"
          Lorsque le prix est égal à 0
          Alors cette donnée devrait être acceptée comme prix de référence
          `, () => {
        expect(
          parseProjectLine({
            ...fakeLine,
            "Appel d'offres": 'blabla Autoconsommation blabla',
            prixReference: '0',
          }),
        ).toMatchObject({ prixReference: 0 });
      });

      it(`Etant donné un appel d'offre ID ne contenant pas "autoconsommation"
          Lorsque le prix est égal à 0
          Alors une erreur devrait être retournée
          `, () => {
        expect(() =>
          parseProjectLine({
            ...fakeLine,
            "Appel d'offres": 'other',
            prixReference: '0',
          }),
        ).toThrowError('Le champ Prix doit être strictement positif');
      });
    });
  });
  describe(`Puissance (obligatoire et strictement positive)`, () => {
    it(`Lorsque la puissance est manquante
        Alors une erreur devrait être retournée`, () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          puissance: '',
        }),
      ).toThrowError('Le champ Puissance doit être un nombre');
    });

    it(`Lorsque la puissance est négative
        Alors une erreur devrait être retournée`, () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          puissance: '-32',
        }),
      ).toThrowError('Le champ Puissance doit être strictement positif');
    });

    it(`Lorsque la puissance est égale à 0
        Alors une erreur devrait être retournée`, () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          puissance: '0',
        }),
      ).toThrowError('Le champ Puissance doit être strictement positif');
    });
  });
  describe(`Email candidat (obligatoire)`, () => {
    it(`Lorsque l'adresse mail du candidat est manquante
        Alors une erreur devrait être retournée`, () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Adresse électronique du contact': '',
        }),
      ).toThrowError(`L'adresse email est manquante`);
    });

    it(`Lorsque l'adresse mail du candidat est invalide
        Alors une erreur devrait être retournée`, () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Adresse électronique du contact': 'not an email',
        }),
      ).toThrowError(`L'adresse email n'est pas valide`);
    });

    it(`Lorsque l'adresse mail du candidat contient des majuscules
        Alors l'adresse devrait être retournée en minuscules`, () => {
      expect(
        parseProjectLine({
          ...fakeLine,
          'Adresse électronique du contact': 'Test@Test.test',
        }),
      ).toMatchObject({ email: 'test@test.test' });
    });
  });
  describe(`Classé / Eliminé (obligatoire)`, () => {
    it(`Lorsque le statut du projet n'est pas correct
        Alors une erreur devrait être retournée`, () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Classé ?': 'pas bon',
        }),
      ).toThrowError("Le champ 'Classé ?' doit être soit 'Eliminé' soit 'Classé'");
    });
  });
  describe(`Motif d'élimination (obligatoire si éliminé)`, () => {
    it(`Etant donné un projet éliminé
        Lorsque le motif d'élimination est complété
        Alors il devrait être enregistré,`, () => {
      expect(
        parseProjectLine({
          ...fakeLine,
          'Classé ?': 'Eliminé',
          "Motif d'élimination": 'compétititivé',
        }),
      ).toMatchObject({ classe: 'Eliminé', motifsElimination: 'compétititivé' });
    });

    it(`Etant donné un projet éliminé
        Lorsque la colonne du motif d'élimination est manquante
        Alors une erreur devrait être retournée,`, () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Classé ?': 'Eliminé',
        }),
      ).toThrowError(
        "Le motif d'élimination doit être précisé (il sera affiché sur l'avis de rejet)",
      );
    });

    it(`Etant donné un projet éliminé
        Lorsque le motif d'élimination n'est pas complété
        Alors une erreur devrait être retournée,`, () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Classé ?': 'Eliminé',
          "Motif d'élimination": '',
        }),
      ).toThrowError(
        "Le motif d'élimination doit être précisé (il sera affiché sur l'avis de rejet)",
      );
    });
  });
  describe(`Note totale (obligatoire)`, () => {
    it(`La note totale peut être un nombre positif, négatif ou égal à 0`, () => {
      expect(
        parseProjectLine({
          ...fakeLine,
          'Note totale': '12',
        }),
      ).toMatchObject({ ...expected, note: 12 });

      expect(
        parseProjectLine({
          ...fakeLine,
          'Note totale': '-12',
        }),
      ).toMatchObject({ ...expected, note: -12 });

      expect(
        parseProjectLine({
          ...fakeLine,
          'Note totale': '0',
        }),
      ).toMatchObject({ ...expected, note: 0 });
    });

    it(`Lorsque la note totale n'est pas renseignée
          Alors une erreur devrait être retournée`, () => {
      const fakeLineWithoutNoteTotale = Object.fromEntries(
        Object.entries(fakeLine).filter(([cle]) => cle !== 'Note totale'),
      );
      expect(() =>
        parseProjectLine({
          ...fakeLineWithoutNoteTotale,
        }),
      ).toThrowError('Le champ "Note totale" doit contenir un nombre');
    });
  });
  describe(`Date de notification (optionnelle)`, () => {
    it(`Si une valeur est présente
      Alors elle devrait être vérifiée et retournée sous forme numérique `, () => {
      expect(
        parseProjectLine({
          ...fakeLine,
          Notification: '22/03/2020',
        }),
      ).toMatchObject({
        notifiedOn: 1584831600000,
      });

      expect(
        parseProjectLine({
          ...fakeLine,
          Notification: '',
        }),
      ).toMatchObject({
        notifiedOn: 0,
      });

      expect(() =>
        parseProjectLine({
          ...fakeLine,
          Notification: 'autre',
        }),
      ).toThrowError(
        "Le champ 'Notification' est erronné (devrait être vide ou une date de la forme 25/12/2020)",
      );

      expect(() =>
        parseProjectLine({
          ...fakeLine,
          Notification: moment().add(1, 'day').format('DD/MM/YYYY'),
        }),
      ).toThrowError(
        "Le champ 'Notification' est erronné (devrait une date antérieure à aujourd'hui)",
      );

      expect(() =>
        parseProjectLine({
          ...fakeLine,
          Notification: '01/01/1999',
        }),
      ).toThrowError("Le champ 'Notification' est erronné (la date parait trop ancienne)");
    });
    it(`La colonne Notification est optionnelle`, () => {
      expect(parseProjectLine(fakeLine)).toMatchObject(expected);
    });
  });
  describe(`Technologie`, () => {
    it(`Le champ "Technologie" peut contenir les valeurs "Hydraulique", "Eolien"
        ou rester vide pour la technologie PV`, () => {
      expect(
        parseProjectLine({
          ...fakeLine,
          'Technologie\n(dispositif de production)': 'Hydraulique',
        }),
      ).toMatchObject({ technologie: 'hydraulique' });

      expect(
        parseProjectLine({
          ...fakeLine,
          'Technologie\n(dispositif de production)': 'Eolien',
        }),
      ).toMatchObject({ technologie: 'eolien' });

      expect(
        parseProjectLine({
          ...fakeLine,
          'Technologie\n(dispositif de production)': '',
        }),
      ).toMatchObject({ technologie: 'pv' });

      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Technologie\n(dispositif de production)': 'bad value',
        }),
      ).toThrowError(
        'Le champ "Technologie" peut contenir les valeurs "Hydraulique", "Eolien" ou rester vide pour la technologie PV',
      );
    });
  });
  describe('Évaluation carbone (obligatoire)', () => {
    it(`Le champ "Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)"
        doit contenir un nombre strictement positif ou N/A`, () => {
      expect(
        parseProjectLine({
          ...fakeLine,
          'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
            '350',
        }),
      ).toMatchObject({
        evaluationCarbone: 350,
      });

      expect(
        parseProjectLine({
          ...fakeLine,
          'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
            'N/A',
        }),
      ).toMatchObject({
        evaluationCarbone: 0,
      });

      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
            '0',
        }),
      ).toThrowError(
        'Le champ "Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)" doit contenir un nombre strictement positif ou N/A',
      );

      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
            '-10',
        }),
      ).toThrowError(
        'Le champ "Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)" doit contenir un nombre strictement positif ou N/A',
      );

      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
            'abcd',
        }),
      ).toThrowError(
        'Le champ "Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)" doit contenir un nombre strictement positif ou N/A',
      );

      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
            '',
        }),
      ).toThrowError(
        'Le champ "Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)" doit contenir un nombre strictement positif ou N/A',
      );

      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
            undefined,
          'Valeur de l’évaluation carbone des modules (kg eq CO2/kWc)': undefined,
        }),
      ).toThrowError(
        'Le champ "Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)" doit contenir un nombre strictement positif ou N/A',
      );
    });
  });
  describe(`Territoire (pour les ZNI uniquement)`, () => {
    it(`Le champ territoire doit être complété pour l'appel d'offres CRE4 - ZNI avec une valeur connue`, () => {
      expect(
        parseProjectLine({
          ...fakeLine,
          "Appel d'offres": 'CRE4 - ZNI',
          'Territoire\n(AO ZNI)': 'Corse',
        }),
      ).toMatchObject({
        territoireProjet: 'Corse',
      });

      expect(
        parseProjectLine({
          ...fakeLine,
          "Appel d'offres": 'Autre', // AO non concerné, on ignore le territoire
          'Territoire\n(AO ZNI)': 'Corse',
        }),
      ).toMatchObject({
        territoireProjet: '',
      });

      expect(() =>
        parseProjectLine({
          ...fakeLine,
          "Appel d'offres": 'CRE4 - ZNI',
          'Territoire\n(AO ZNI)': 'Autre', // valeur inconnue
        }),
      ).toThrowError("Le champ 'Territoire (AO ZNI)' a une valeur erronnée");

      expect(() =>
        parseProjectLine({
          ...fakeLine,
          "Appel d'offres": 'CRE4 - ZNI',
          'Territoire\n(AO ZNI)': '', // territoire manquant
        }),
      ).toThrowError("Le champ 'Territoire (AO ZNI)' est requis pour cet Appel d'offres");
    });
  });
  describe(`Engagement de fourniture de puissance à la pointe (ZNI)`, () => {
    it(`Le champ 'Engagement de fourniture de puissance à la pointe (AO ZNI)' doit être vide ou 'Oui'`, () => {
      expect(
        parseProjectLine({
          ...fakeLine,
          'Engagement de fourniture de puissance à la pointe\n(AO ZNI)': 'Oui',
        }),
      ).toMatchObject({
        engagementFournitureDePuissanceAlaPointe: true,
      });

      expect(
        parseProjectLine({
          ...fakeLine,
          'Engagement de fourniture de puissance à la pointe\n(AO ZNI)': '',
        }),
      ).toMatchObject({
        engagementFournitureDePuissanceAlaPointe: false,
      });

      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Engagement de fourniture de puissance à la pointe\n(AO ZNI)': 'pas bon',
        }),
      ).toThrowError(
        "Le champ 'Engagement de fourniture de puissance à la pointe (AO ZNI)' doit être vide ou 'Oui'",
      );
    });
  });
  describe(`Actionnariat : Financement collectif / Gouvernance partagée (obligatoire)`, () => {
    it(`Lorsque l'une des colonnes Financement collectif et Gouvernance partagée est manquante
        Alors une erreur devrait être retournée`, () => {
      const fakeLineWithoutFinancementCollectif = Object.fromEntries(
        Object.entries(fakeLine).filter(([cle]) => cle !== 'Financement collectif (Oui/Non)'),
      );
      expect(() =>
        parseProjectLine({
          ...fakeLineWithoutFinancementCollectif,
        }),
      ).toThrowError(
        `Les colonnes 'Financement collectif (Oui/Non)' et 'Gouvernance partagée (Oui/Non)' sont obligatoires`,
      );

      const fakeLineWithoutGouvernancePartagée = Object.fromEntries(
        Object.entries(fakeLine).filter(([cle]) => cle !== 'Gouvernance partagée (Oui/Non)'),
      );
      expect(() =>
        parseProjectLine({
          ...fakeLineWithoutGouvernancePartagée,
        }),
      ).toThrowError(
        `Les colonnes 'Financement collectif (Oui/Non)' et 'Gouvernance partagée (Oui/Non)' sont obligatoires`,
      );
    });

    it(`Lorsque l'une des colonnes Financement collectif et Gouvernance partagée n'est pas complétée par Oui ou Non
        Alors une erreur devrait être retournée`, () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Gouvernance partagée (Oui/Non)': 'abcd',
          'Financement collectif (Oui/Non)': 'Non',
        }),
      ).toThrowError(
        `Les champs Financement collectif et Gouvernance partagée doivent être soit 'Oui' soit 'Non'`,
      );
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Financement collectif (Oui/Non)': 'abcd',
          'Gouvernance partagée (Oui/Non)': 'Non',
        }),
      ).toThrowError(
        `Les champs Financement collectif et Gouvernance partagée doivent être soit 'Oui' soit 'Non'`,
      );
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Gouvernance partagée (Oui/Non)': '',
          'Financement collectif (Oui/Non)': '',
        }),
      ).toThrowError(
        `Les champs Financement collectif et Gouvernance partagée doivent être soit 'Oui' soit 'Non'`,
      );
    });

    it(`Si les deux champs Financement collectif et Gouvernance partagée sont 'Oui
        Alors une erreur devrait être retournée`, () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Financement collectif (Oui/Non)': 'Oui',
          'Gouvernance partagée (Oui/Non)': 'Oui',
        }),
      ).toThrowError(
        'Les deux champs Financement collectif et Gouvernance partagée ne peuvent pas être tous les deux à "Oui"',
      );
    });

    it(`Les valeurs 'financement-collectif', ''gouvernance-partagee' ou undefined
      peuvent être affectées à la propriété 'actionnariat'`, () => {
      expect(
        parseProjectLine({
          ...fakeLine,
          'Financement collectif (Oui/Non)': 'Oui',
          'Gouvernance partagée (Oui/Non)': 'Non',
        }),
      ).toMatchObject({
        actionnariat: 'financement-collectif',
      });

      expect(
        parseProjectLine({
          ...fakeLine,
          'Financement collectif (Oui/Non)': 'Non',
          'Gouvernance partagée (Oui/Non)': 'Oui',
        }),
      ).toMatchObject({
        actionnariat: 'gouvernance-partagee',
      });

      expect(
        parseProjectLine({
          ...fakeLine,
          'Financement collectif (Oui/Non)': 'Non',
          'Gouvernance partagée (Oui/Non)': 'Non',
        }),
      ).toMatchObject({
        actionnariat: undefined,
      });
    });
  });
  describe(`Investissement / financement participatif (optionnel)`, () => {
    it(`La valeur de la colonne 'Investissement ou financement participatif ?' doit impacter les deux propriétés isInvestissementParticipatif et  isFinancementParticipatif`, () => {
      expect(
        parseProjectLine({
          ...fakeLine,
          'Investissement ou financement participatif ?': 'Investissement participatif (T1)',
        }),
      ).toMatchObject({
        isInvestissementParticipatif: true,
        isFinancementParticipatif: false,
      });

      expect(
        parseProjectLine({
          ...fakeLine,
          'Investissement ou financement participatif ?': 'Financement participatif (T2)',
        }),
      ).toMatchObject({
        isInvestissementParticipatif: false,
        isFinancementParticipatif: true,
      });

      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Investissement ou financement participatif ?': 'autre',
        }),
      ).toThrowError(
        "Le champ 'Investissement ou financement participatif ?' a une valeur erronnée",
      );
    });
    it(`Lorsque la colonne 'Investissement ou financement participatif ?' n'existe pas
        Alors la valeur "false" est appliquée aux propriétés isInvestissementParticipatif et isFinancementParticipatif
    `, () => {
      expect(
        parseProjectLine({
          ...fakeLine,
        }),
      ).toMatchObject({
        isInvestissementParticipatif: false,
        isFinancementParticipatif: false,
      });
    });
  });
  describe(`Garanties financières`, () => {
    it(`la colonne contenant le type de garanties financières doit impacter la propriété garantiesFinancièresType`, () => {
      expect(
        parseProjectLine({
          ...fakeLine,
          "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation":
            '1',
        }),
      ).toMatchObject({
        garantiesFinancièresType: `Garantie financière jusqu'à 6 mois après la date d'achèvement`,
      });

      expect(
        parseProjectLine({
          ...fakeLine,
          "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation":
            '2',
          "Date d'échéance au format JJ/MM/AAAA": '01/01/2021',
        }),
      ).toMatchObject({
        garantiesFinancièresType: `Garantie financière avec date d'échéance et à renouveler`,
      });

      expect(
        parseProjectLine({
          ...fakeLine,
          "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation":
            '3',
        }),
      ).toMatchObject({ garantiesFinancièresType: `Consignation` });

      expect(
        parseProjectLine({
          ...fakeLine,
        }).garantiesFinancièresType,
      ).toBe(undefined);
    });

    describe(`Étant donné un projet classé`, () => {
      it(`Lorsque le type n'est pas 1, 2 ou 3
          Alors une erreur devrait être retournée`, () => {
        expect(() =>
          parseProjectLine({
            ...fakeLine,
            'Classé ?': 'Classé',
            "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation":
              'bad value',
          }),
        ).toThrowError(
          `Le champ "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation" doit contenir l'une des valeurs suivantes : 1, 2, ou 3. La valeur N/A est acceptée pour les projets éliminés.`,
        );
      });

      it(`Lorsque la colonne type existe mais qu'aucune valeur n'est affectée pour le projet
          Alors une erreur devrait être retournée`, () => {
        expect(() =>
          parseProjectLine({
            ...fakeLine,
            'Classé ?': 'Classé',
            "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation":
              '',
          }),
        ).toThrowError(
          `Le champ "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation" doit contenir l'une des valeurs suivantes : 1, 2, ou 3. La valeur N/A est acceptée pour les projets éliminés.`,
        );
      });
    });

    describe(`Étant donné un projet éliminé`, () => {
      it(`Lorsque le type est une valeur autre que 1, 2, 3 or N/A
          Alors une erreur devrait être retournée`, () => {
        expect(() =>
          parseProjectLine({
            ...fakeLine,
            'Classé ?': 'Eliminé',
            "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation":
              'bad value',
          }),
        ).toThrowError(
          `Le champ "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation" doit contenir l'une des valeurs suivantes : 1, 2, ou 3. La valeur N/A est acceptée pour les projets éliminés.`,
        );
      });

      it(`Lorsqu'aucun type n'est affecté à la colonne type
          Alors une erreur devrait être retournée`, () => {
        expect(() =>
          parseProjectLine({
            ...fakeLine,
            'Classé ?': 'Eliminé',
            "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation":
              '',
          }),
        ).toThrowError(
          `Le champ "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation" doit contenir l'une des valeurs suivantes : 1, 2, ou 3. La valeur N/A est acceptée pour les projets éliminés.`,
        );
      });

      it(`La valeur "N/A" devrait être acceptée`, () => {
        expect(() =>
          parseProjectLine({
            ...fakeLine,
            'Classé ?': 'Eliminé',
            "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation":
              'N/A',
          }),
        ).not.toThrowError(
          `Le champ "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation" doit contenir l'une des valeurs suivantes : 1, 2, ou 3. La valeur N/A est acceptée pour les projets éliminés.`,
        );
      });
    });

    describe(`Cas du type "Garantie financière avec date d'échéance et à renouveler"`, () => {
      it(`La date d'échéance devrait être enregistrée`, () => {
        expect(
          parseProjectLine({
            ...fakeLine,
            "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation":
              '2',
            "Date d'échéance au format JJ/MM/AAAA": '24/01/2034',
          }),
        ).toMatchObject({
          garantiesFinancièresType: `Garantie financière avec date d'échéance et à renouveler`,
          garantiesFinancièresDateEchéance: new Date('2034-01-24').toDateString(),
        });
      });

      it(`Lorsque la date d'échéance a un mauvais format
          Alors une erreur devrait être retournée`, () => {
        expect(() =>
          parseProjectLine({
            ...fakeLine,
            "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation":
              '2',
            "Date d'échéance au format JJ/MM/AAAA": 'coucou',
          }),
        ).toThrowError(
          `La date d'échéance des garanties financières doit être au format JJ/MM/AAAA`,
        );
      });

      it(`Lorsque la date d'échéance est manquante
          Alors une erreur devrait être retournée`, () => {
        expect(() =>
          parseProjectLine({
            ...fakeLine,
            "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation":
              '2',
            "Date d'échéance au format JJ/MM/AAAA": null,
          }),
        ).toThrowError(
          `La date d'échéance des garanties financières doit être au format JJ/MM/AAAA`,
        );
      });
    });

    describe(`Cas d'un type autre que "Garantie financière avec date d'échéance et à renouveler"`, () => {
      it(`Lorsque le type est 1
          Et qu'une date d'échéance est renseignée
          Alors une erreur devrait être retourée`, () => {
        expect(() =>
          parseProjectLine({
            ...fakeLine,
            "Date d'échéance au format JJ/MM/AAAA": '13/02/2021',
            "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation":
              '1',
          }),
        ).toThrowError(`Ce type de garanties financières n'accepte pas de date d'échéance`);
      });

      it(`Lorsque le type est 3
          Et qu'une date d'échéance est renseignée
          Alors une erreur devrait être retourée`, () => {
        expect(() =>
          parseProjectLine({
            ...fakeLine,
            "Date d'échéance au format JJ/MM/AAAA": '13/02/2021',
            "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation":
              '3',
          }),
        ).toThrowError(`Ce type de garanties financières n'accepte pas de date d'échéance`);
      });
    });
  });
  describe(`Historique abandon (colonne "1. 1ère candidature/n2. Abandon classique/n3. Abandon avec recandidature")`, () => {
    it(`Lorsque la valeur 1, 2, 3, ou 4 est saisie
        Alors la valeur correspondante devrait être enregistrée`, () => {
      expect(
        parseProjectLine({
          ...fakeLine,
          "1. 1ère candidature\n2. Abandon classique\n3. Abandon avec recandidature\n4. Lauréat d'une autre période":
            '1',
        }),
      ).toMatchObject({
        historiqueAbandon: `première-candidature`,
      });

      expect(
        parseProjectLine({
          ...fakeLine,
          "1. 1ère candidature\n2. Abandon classique\n3. Abandon avec recandidature\n4. Lauréat d'une autre période":
            '2',
        }),
      ).toMatchObject({
        historiqueAbandon: `abandon-classique`,
      });

      expect(
        parseProjectLine({
          ...fakeLine,
          "1. 1ère candidature\n2. Abandon classique\n3. Abandon avec recandidature\n4. Lauréat d'une autre période":
            '3',
        }),
      ).toMatchObject({
        historiqueAbandon: `abandon-avec-recandidature`,
      });

      expect(
        parseProjectLine({
          ...fakeLine,
          "1. 1ère candidature\n2. Abandon classique\n3. Abandon avec recandidature\n4. Lauréat d'une autre période":
            '4',
        }),
      ).toMatchObject({
        historiqueAbandon: 'lauréat-autre-période',
      });
    });

    it(`Si la colonne est manquante
        Alors une erreur devrait être retournée`, () => {
      const fakeLineWithoutHistoriqueAbandon = Object.fromEntries(
        Object.entries(fakeLine).filter(
          ([cle]) =>
            cle !==
            "1. 1ère candidature\n2. Abandon classique\n3. Abandon avec recandidature\n4. Lauréat d'une autre période",
        ),
      );
      expect(() =>
        parseProjectLine({
          ...fakeLineWithoutHistoriqueAbandon,
        }),
      ).toThrowError(
        `La colonne "1. 1ère candidature 2. Abandon classique 3. Abandon avec recandidature 4. Lauréat d'une autre période" est obligatoire et doit être complétée par 1, 2, 3 ou 4.`,
      );
    });

    it(`Si la colonne n'est pas complétée
        Alors une erreur devrait être retournée`, () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          "1. 1ère candidature\n2. Abandon classique\n3. Abandon avec recandidature\n4. Lauréat d'une autre période":
            '',
        }),
      ).toThrowError(
        `La colonne "1. 1ère candidature 2. Abandon classique 3. Abandon avec recandidature 4. Lauréat d'une autre période" est obligatoire et doit être complétée par 1, 2, 3 ou 4.`,
      );
    });

    it(`Si la colonne estcomplétée avec une valeur autre que 1, 2, 3 ou 4
        Alors une erreur devrait être retournée`, () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          "1. 1ère candidature\n2. Abandon classique\n3. Abandon avec recandidature\n4. Lauréat d'une autre période":
            'bad value',
        }),
      ).toThrowError(
        `La colonne "1. 1ère candidature 2. Abandon classique 3. Abandon avec recandidature 4. Lauréat d'une autre période" est obligatoire et doit être complétée par 1, 2, 3 ou 4.`,
      );
    });
  });
});
