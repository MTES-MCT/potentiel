import moment from 'moment'
import { parseProjectLine } from './parseProjectLine'

const fakeLine = {
  "Appel d'offres": 'appelOffreId',
  Période: 'periodeId',
  Famille: 'familleId',
  'Nom (personne physique) ou raison sociale (personne morale) :': 'nomCandidat',
  Candidat: '',
  'Nom projet': 'nomProjet',
  'Société mère': 'actionnaire',
  'N°CRE': 'numeroCRE',
  'Puissance installé du projet indiquée au B. du formulaire de candidature (MWc)': '1.234',
  'Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)': '3.456',
  'Note totale': '10.10',
  'Nom et prénom du représentant légal': 'nomRepresentantLegal',
  'Adresse électronique du contact': 'test@test.test',
  'N°, voie, lieu-dit': 'adresseProjet',
  'N°, voie, lieu-dit 1': '',
  'N°, voie, lieu-dit 2': '',
  CP: '69100 / 01390',
  Commune: 'communeProjet',
  'Classé ?': 'Eliminé',
  "Motif d'élimination": 'motifsElimination',
  'Investissement ou financement participatif ?': '',
  Notification: '',
  'Engagement de fourniture de puissance à la pointe\n(AO ZNI)': '',
  'Territoire\n(AO ZNI)': '',
  'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
    '230.50',
  'Valeur de l’évaluation carbone des modules (kg eq CO2/kWc)': '',
  Autre: 'valeur',
}

describe('parseProjectLine', () => {
  it('should return the project properties', () => {
    const project = parseProjectLine(fakeLine)

    expect(project).toMatchObject({
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
      classe: 'Eliminé',
      motifsElimination: 'motifsElimination',
      isInvestissementParticipatif: false,
      isFinancementParticipatif: false,
      notifiedOn: 0,
      engagementFournitureDePuissanceAlaPointe: false,
      territoireProjet: '',
      evaluationCarbone: 230.5,
      technologie: 'N/A',
      details: {
        Autre: 'valeur',
      },
    })
  })

  it('should parse the N°, voie, lieu-dit" columns', () => {
    expect(
      parseProjectLine({
        ...fakeLine,
        'N°, voie, lieu-dit': 'adresseProjet',
      })
    ).toMatchObject({ adresseProjet: 'adresseProjet' })

    expect(
      parseProjectLine({
        ...fakeLine,
        'N°, voie, lieu-dit 1': 'adresseProjetPart1',
        'N°, voie, lieu-dit 2': 'adresseProjetPart2',
      })
    ).toMatchObject({ adresseProjet: 'adresseProjetPart1\nadresseProjetPart2' })

    expect(
      parseProjectLine({
        ...fakeLine,
        'N°, voie, lieu-dit 1': 'adresseProjetPart1',
        'N°, voie, lieu-dit 2': '',
      })
    ).toMatchObject({ adresseProjet: 'adresseProjetPart1' })

    expect(
      parseProjectLine({
        ...fakeLine,
        'N°, voie, lieu-dit 1': '',
        'N°, voie, lieu-dit 2': 'adresseProjetPart2',
      })
    ).toMatchObject({ adresseProjet: 'adresseProjetPart2' })

    expect(() =>
      parseProjectLine({
        ...fakeLine,
        'N°, voie, lieu-dit': '',
        'N°, voie, lieu-dit 1': '',
        'N°, voie, lieu-dit 2': '',
      })
    ).toThrowError(`L'adresse du projet est manquante`)
  })

  it('should parse the "Technologie\n(dispositif de production)" column', () => {
    expect(
      parseProjectLine({
        ...fakeLine,
        'Technologie\n(dispositif de production)': 'Hydraulique',
      })
    ).toMatchObject({ technologie: 'hydraulique' })

    expect(
      parseProjectLine({
        ...fakeLine,
        'Technologie\n(dispositif de production)': 'Eolien',
      })
    ).toMatchObject({ technologie: 'eolien' })

    expect(
      parseProjectLine({
        ...fakeLine,
        'Technologie\n(dispositif de production)': '',
      })
    ).toMatchObject({ technologie: 'pv' })

    expect(() =>
      parseProjectLine({
        ...fakeLine,
        'Technologie\n(dispositif de production)': 'bad value',
      })
    ).toThrowError(
      'Le champ "Technologie" peut contenir les valeurs "Hydraulique", "Eolien" ou rester vide pour la technologie PV'
    )
  })

  it("should parse the 'actionnariat' column", () => {
    expect(
      parseProjectLine({
        ...fakeLine,
        'Financement collectif (Oui/Non)': 'Oui',
        'Gouvernance partagée (Oui/Non)': 'Non',
      })
    ).toMatchObject({
      actionnariat: 'financement-collectif',
    })

    expect(
      parseProjectLine({
        ...fakeLine,
        'Financement collectif (Oui/Non)': 'Non',
        'Gouvernance partagée (Oui/Non)': 'Oui',
      })
    ).toMatchObject({
      actionnariat: 'gouvernance-partagee',
    })

    expect(
      parseProjectLine({
        ...fakeLine,
        'Financement collectif (Oui/Non)': 'Non',
        'Gouvernance partagée (Oui/Non)': 'Non',
      })
    ).toMatchObject({
      actionnariat: null,
    })

    expect(
      parseProjectLine({
        ...fakeLine,
        'Financement collectif (Oui/Non)': '',
        'Gouvernance partagée (Oui/Non)': '',
      })
    ).toMatchObject({
      actionnariat: null,
    })

    expect(() =>
      parseProjectLine({
        ...fakeLine,
        'Financement collectif (Oui/Non)': 'Oui',
        'Gouvernance partagée (Oui/Non)': 'Oui',
      })
    ).toThrowError(
      'Les deux champs Financement collectif et Gouvernance partagée ne peuvent pas être tous les deux à "Oui"'
    )

    expect(() =>
      parseProjectLine({
        ...fakeLine,
        'Financement collectif (Oui/Non)': 'abcd',
      })
    ).toThrowError(
      `Les champs Financement collectif et Gouvernance partagée doivent être soit 'Oui' soit 'Non'`
    )

    expect(() =>
      parseProjectLine({
        ...fakeLine,
        'Gouvernance partagée (Oui/Non)': 'abcd',
      })
    ).toThrowError(
      `Les champs Financement collectif et Gouvernance partagée doivent être soit 'Oui' soit 'Non'`
    )
  })

  it("should parse the 'Investissement ou financement participatif ?' column", () => {
    expect(
      parseProjectLine({
        ...fakeLine,
        'Investissement ou financement participatif ?': 'Investissement participatif (T1)',
      })
    ).toMatchObject({
      isInvestissementParticipatif: true,
      isFinancementParticipatif: false,
    })

    expect(
      parseProjectLine({
        ...fakeLine,
        'Investissement ou financement participatif ?': 'Financement participatif (T2)',
      })
    ).toMatchObject({
      isInvestissementParticipatif: false,
      isFinancementParticipatif: true,
    })

    expect(() =>
      parseProjectLine({
        ...fakeLine,
        'Investissement ou financement participatif ?': 'autre',
      })
    ).toThrowError("Le champ 'Investissement ou financement participatif ?' a une valeur erronnée")
  })

  it("should parse the 'Notification' column", () => {
    expect(
      parseProjectLine({
        ...fakeLine,
        Notification: '22/03/2020',
      })
    ).toMatchObject({
      notifiedOn: 1584831600000,
    })

    expect(
      parseProjectLine({
        ...fakeLine,
        Notification: '',
      })
    ).toMatchObject({
      notifiedOn: 0,
    })

    expect(() =>
      parseProjectLine({
        ...fakeLine,
        Notification: 'autre',
      })
    ).toThrowError(
      "Le champ 'Notification' est erronné (devrait être vide ou une date de la forme 25/12/2020)"
    )

    expect(() =>
      parseProjectLine({
        ...fakeLine,
        Notification: moment().add(1, 'day').format('DD/MM/YYYY'),
      })
    ).toThrowError(
      "Le champ 'Notification' est erronné (devrait une date antérieure à aujourd'hui)"
    )

    expect(() =>
      parseProjectLine({
        ...fakeLine,
        Notification: '01/01/1999',
      })
    ).toThrowError("Le champ 'Notification' est erronné (la date parait trop ancienne)")
  })

  describe("when the Appel d'offres is missing", () => {
    it('should throw an error', () => {
      expect(() => parseProjectLine({ ...fakeLine, "Appel d'offres": '' })).toThrowError(
        "Appel d'offres manquant"
      )
    })
  })

  describe('when the Période is missing', () => {
    it('should throw an error', () => {
      expect(() => parseProjectLine({ ...fakeLine, Période: '' })).toThrowError('Période manquante')
    })
  })

  describe('when the N°CRE is missing', () => {
    it('should throw an error', () => {
      expect(() => parseProjectLine({ ...fakeLine, 'N°CRE': '' })).toThrowError('N°CRE manquant')
    })
  })

  describe('when the Candidat is missing', () => {
    it('should throw an error', () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Nom (personne physique) ou raison sociale (personne morale) :': '',
          Candidat: '',
        })
      ).toThrowError('Candidat manquant')
    })
  })

  describe('when the puissance is missing', () => {
    it('should throw an error', () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Puissance installé du projet indiquée au B. du formulaire de candidature (MWc)': '',
        })
      ).toThrowError('Le champ Puissance doit être un nombre')
    })
  })

  describe('when the puissance is negative', () => {
    it('should throw an error', () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Puissance installé du projet indiquée au B. du formulaire de candidature (MWc)': '-32',
        })
      ).toThrowError('Le champ Puissance doit être strictement positif')
    })
  })

  describe('when the puissance is 0', () => {
    it('should throw an error', () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Puissance installé du projet indiquée au B. du formulaire de candidature (MWc)': '0',
        })
      ).toThrowError('Le champ Puissance doit être strictement positif')
    })
  })

  describe('when the prix is missing', () => {
    it('should throw an error', () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)': '',
        })
      ).toThrowError('Le Prix doit être un nombre')
    })
  })

  describe('when the prix is negative', () => {
    it('should throw an error', () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)':
            '-32',
        })
      ).toThrowError('Le champ Prix doit être strictement positif')
    })
  })

  describe('when the prix is 0', () => {
    describe('when the appelOffreId contains autoconsommation', () => {
      it('should accept 0 as the value', () => {
        expect(
          parseProjectLine({
            ...fakeLine,
            "Appel d'offres": 'blabla Autoconsommation blabla',
            'Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)':
              '0',
          })
        ).toMatchObject({ prixReference: 0 })
      })
    })

    describe('when the appelOffreId does not contain autoconsommation', () => {
      it('should throw an error', () => {
        expect(() =>
          parseProjectLine({
            ...fakeLine,
            "Appel d'offres": 'other',
            'Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)':
              '0',
          })
        ).toThrowError('Le champ Prix doit être strictement positif')
      })
    })
  })

  describe('when the email is missing', () => {
    it('should throw an error', () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Adresse électronique du contact': '',
        })
      ).toThrowError(`L'adresse email est manquante`)
    })
  })

  describe('when the email is not a valid email', () => {
    it('should throw an error', () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Adresse électronique du contact': 'not an email',
        })
      ).toThrowError(`L'adresse email n'est pas valide`)
    })
  })

  describe('when the email is not lowercase', () => {
    it('should lowercase it', () => {
      expect(
        parseProjectLine({
          ...fakeLine,
          'Adresse électronique du contact': 'Test@Test.test',
        })
      ).toMatchObject({ email: 'test@test.test' })
    })
  })

  describe('when the Code Postal is missing', () => {
    it('should throw an error', () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          CP: '',
        })
      ).toThrowError(`Code Postal manquant`)
    })
  })

  describe('when the Code Postal is malformed', () => {
    it('should throw an error', () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          CP: 'not a code postal',
        })
      ).toThrowError(`Code Postal mal formé`)
    })
  })

  describe('when the Code Postal has one malformed item', () => {
    it('should throw an error', () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          CP: '69100 / non',
        })
      ).toThrowError(`Code Postal mal formé`)
    })
  })

  describe('when the Code Postal corresponds to no departement/region', () => {
    it('should throw an error', () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          CP: '96000',
        })
      ).toThrowError(`Le Code Postal ne correspond à aucun département`)
    })
  })

  describe('when the Code Postal is only 4 numbers', () => {
    it('should parse it', () => {
      expect(
        parseProjectLine({
          ...fakeLine,
          CP: '1390',
        })
      ).toMatchObject({ codePostalProjet: '01390' })
    })
  })

  describe('when Classé? is malformed', () => {
    it('should throw an error', () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Classé ?': 'pas bon',
        })
      ).toThrowError("Le champ 'Classé ?' doit être soit 'Eliminé' soit 'Classé'")
    })
  })

  it('should parse Engagement de fourniture de puissance à la pointe\n(AO ZNI) column', () => {
    expect(
      parseProjectLine({
        ...fakeLine,
        'Engagement de fourniture de puissance à la pointe\n(AO ZNI)': 'Oui',
      })
    ).toMatchObject({
      engagementFournitureDePuissanceAlaPointe: true,
    })

    expect(
      parseProjectLine({
        ...fakeLine,
        'Engagement de fourniture de puissance à la pointe\n(AO ZNI)': '',
      })
    ).toMatchObject({
      engagementFournitureDePuissanceAlaPointe: false,
    })

    expect(() =>
      parseProjectLine({
        ...fakeLine,
        'Engagement de fourniture de puissance à la pointe\n(AO ZNI)': 'pas bon',
      })
    ).toThrowError(
      "Le champ 'Engagement de fourniture de puissance à la pointe (AO ZNI)' doit être vide ou 'Oui'"
    )
  })

  it('should parse Territoire column for applicable AO', () => {
    expect(
      parseProjectLine({
        ...fakeLine,
        "Appel d'offres": 'CRE4 - ZNI',
        'Territoire\n(AO ZNI)': 'Corse',
      })
    ).toMatchObject({
      territoireProjet: 'Corse',
    })

    expect(
      parseProjectLine({
        ...fakeLine,
        "Appel d'offres": 'Autre', // AO non concerné, on ignore le territoire
        'Territoire\n(AO ZNI)': 'Corse',
      })
    ).toMatchObject({
      territoireProjet: '',
    })

    expect(() =>
      parseProjectLine({
        ...fakeLine,
        "Appel d'offres": 'CRE4 - ZNI',
        'Territoire\n(AO ZNI)': 'Autre',
      })
    ).toThrowError("Le champ 'Territoire (AO ZNI)' a une valeur erronnée")

    expect(() =>
      parseProjectLine({
        ...fakeLine,
        "Appel d'offres": 'CRE4 - ZNI',
        'Territoire\n(AO ZNI)': '',
      })
    ).toThrowError("Le champ 'Territoire (AO ZNI)' est requis pour cet Appel d'offres")
  })

  describe('concerning the evaluation carbone column', () => {
    it('should accept a positive number as a value', () => {
      expect(
        parseProjectLine({
          ...fakeLine,
          'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
            '350',
        })
      ).toMatchObject({
        evaluationCarbone: 350,
      })
    })

    it('should accept N/A as a value', () => {
      expect(
        parseProjectLine({
          ...fakeLine,
          'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
            'N/A',
        })
      ).toMatchObject({
        evaluationCarbone: 0,
      })
    })

    it('should throw an error if ecs is not strictly positive', () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
            '0',
        })
      ).toThrowError('Le champ Evaluation Carbone doit contenir un nombre strictement positif')

      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
            '-10',
        })
      ).toThrowError('Le champ Evaluation Carbone doit contenir un nombre strictement positif')
    })

    it('should throw an error if ecs is not a number', () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
            'abcd',
        })
      ).toThrowError('Le champ Evaluation carbone doit contenir un nombre')

      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
            '',
        })
      ).toThrowError('Le champ Evaluation carbone doit contenir un nombre')

      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
            undefined,
          'Valeur de l’évaluation carbone des modules (kg eq CO2/kWc)': undefined,
        })
      ).toThrowError('Le champ Evaluation carbone doit contenir un nombre')
    })
  })
})
