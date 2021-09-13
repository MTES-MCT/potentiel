import { parseProjectLine } from './parseProjectLine'

const fakeLine = {
  "Appel d'offres": 'appelOffreId',
  Période: 'periodeId',
  Famille: 'familleId',
  'Nom (personne physique) ou raison sociale (personne morale) :': 'nomCandidat',
  Candidat: '',
  'Nom projet': 'nomProjet',
  'N°CRE': 'numeroCRE',
  'Puissance installé du projet indiquée au B. du formulaire de candidature (MWc)': '1.234',
  'Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)': '3.456',
  'Note totale': '10.10',
  'Nom et prénom du représentant légal': 'nomRepresentantLegal',
  'Adresse électronique du contact': 'test@test.test',
  'N°, voie, lieu-dit': 'adresseProjet',
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
      details: {
        Autre: 'valeur',
      },
    })
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
    ).toThrowError(
      "Le champ 'Investissement ou financement participatif ?' a une valeur erronnée (autre)"
    )
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
      'Le champ Notification est erronné (devrait être vide ou une date de la forme 25/12/2020)'
    )
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
      ).toThrowError('Le champ Puissance est manquant')
    })
  })

  describe('when the puissance is negative', () => {
    it('should throw an error', () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Puissance installé du projet indiquée au B. du formulaire de candidature (MWc)': '-32',
        })
      ).toThrowError('Le champ Puissance doit être strictement positif (-32)')
    })
  })

  describe('when the puissance is 0', () => {
    it('should throw an error', () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Puissance installé du projet indiquée au B. du formulaire de candidature (MWc)': '0',
        })
      ).toThrowError('Le champ Puissance doit être strictement positif (0)')
    })
  })

  describe('when the prix is missing', () => {
    it('should throw an error', () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)': '',
        })
      ).toThrowError('Le Prix est manquant')
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
      ).toThrowError('Le Prix doit être strictement positif (-32)')
    })
  })

  describe('when the prix is 0', () => {
    it('should throw an error', () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)': '0',
        })
      ).toThrowError('Le Prix doit être strictement positif (0)')
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

  describe('when Classé? is malformed', () => {
    it('should throw an error', () => {
      expect(() =>
        parseProjectLine({
          ...fakeLine,
          'Classé ?': 'pas bon',
        })
      ).toThrowError("Le champ 'Classé ?' doit être soit 'Eliminé' soit 'Classé' (ici 'pas bon')")
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
      "Le champ Engagement de fourniture de puissance à la pointe (AO ZNI) doit être vide ou 'Oui' (ici 'pas bon')"
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
    ).toThrowError("Le champ Territoire (AO ZNI) a une valeur erronnée ('Autre')")

    expect(() =>
      parseProjectLine({
        ...fakeLine,
        "Appel d'offres": 'CRE4 - ZNI',
        'Territoire\n(AO ZNI)': '',
      })
    ).toThrowError("Le champ Territoire (AO ZNI) est requis pour cet Appel d'offres")
  })
})
