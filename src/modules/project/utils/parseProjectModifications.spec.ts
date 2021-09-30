import moment from 'moment'
import { parseProjectModifications } from './parseProjectModifications'

describe('parseProjectModifications', () => {
  describe('when line has a single Abandon modification', () => {
    const phonyLine = {
      'Type de modification 1': 'Abandon',
      'Date de modification 1': '25/04/2019',
      'Colonne concernée 1': '',
      'Ancienne valeur 1': '',
    }

    it('should return a modification of type abandon', async () => {
      const modifications = parseProjectModifications(phonyLine)

      expect(modifications).toHaveLength(1)
      expect(modifications[0]).toMatchObject({
        type: 'abandon',
        modifiedOn: 1556143200000,
      })
    })
  })

  describe('when line has a single Autre modification', () => {
    const phonyLine = {
      'Type de modification 1': 'Autre',
      'Date de modification 1': '25/04/2019',
      'Colonne concernée 1': 'column',
      'Ancienne valeur 1': 'value',
    }

    it('should return a modification of type autre', async () => {
      const modifications = parseProjectModifications(phonyLine)

      expect(modifications).toHaveLength(1)
      expect(modifications[0]).toMatchObject({
        type: 'autre',
        modifiedOn: 1556143200000,
        column: 'column',
        value: 'value',
      })
    })
  })

  describe('when line has a single Recours modification that was rejected', () => {
    const phonyLine = {
      'Type de modification 1': 'Recours gracieux',
      'Date de modification 1': '25/04/2019',
      'Colonne concernée 1': 'Classé ?',
      'Ancienne valeur 1': 'Eliminé',
    }

    it('should return a modification of type recours and rejected', async () => {
      const modifications = parseProjectModifications(phonyLine)

      expect(modifications).toHaveLength(1)
      expect(modifications[0]).toMatchObject({
        type: 'recours',
        accepted: false,
        modifiedOn: 1556143200000,
      })
    })
  })

  describe('when line has a single Recours modification that was accepted', () => {
    const phonyLine = {
      'Type de modification 1': 'Recours gracieux',
      'Date de modification 1': '25/04/2019',
      'Colonne concernée 1': 'Classé ?',
      'Ancienne valeur 1': 'Classé',
    }

    it('should return a modification of type recours and accepted', async () => {
      const modifications = parseProjectModifications(phonyLine)

      expect(modifications).toHaveLength(1)
      expect(modifications[0]).toMatchObject({
        type: 'recours',
        accepted: true,
        modifiedOn: 1556143200000,
      })
    })
  })
  describe('when line has a single Recours modification that was accepted and contains the previous motifElimination', () => {
    const phonyLine = {
      'Type de modification 1': 'Recours gracieux',
      'Date de modification 1': '25/04/2019',
      'Colonne concernée 1': 'Classé ?',
      'Ancienne valeur 1': 'Classé',
      'Type de modification 2': 'Recours gracieux',
      'Date de modification 2': '25/04/2019',
      'Colonne concernée 2': "Motif d'élimination",
      'Ancienne valeur 2': 'Ancien motif',
    }

    it('should return a modification of type recours, accepted and contain the previous motifs', async () => {
      const modifications = parseProjectModifications(phonyLine)

      expect(modifications).toHaveLength(1)
      expect(modifications[0]).toMatchObject({
        type: 'recours',
        accepted: true,
        modifiedOn: 1556143200000,
        motifElimination: 'Ancien motif',
      })
    })
  })

  describe('when line has a single Prolongation de délai modification', () => {
    const phonyLine = {
      'Type de modification 1': 'Prolongation de délai',
      'Date de modification 1': '25/04/2019',
      'Colonne concernée 1': '22/12/2024',
      'Ancienne valeur 1': '01/01/2024',
    }

    it('should return a modification of type delai with the proper dates', async () => {
      const modifications = parseProjectModifications(phonyLine)

      expect(modifications).toHaveLength(1)
      expect(modifications[0]).toMatchObject({
        type: 'delai',
        nouvelleDateLimiteAchevement: 1734822000000,
        ancienneDateLimiteAchevement: 1704063600000,
        modifiedOn: 1556143200000,
      })
    })
  })

  describe('when line has a Actionnaire modification', () => {
    const phonyLine = {
      'Type de modification 1': "Changement d'actionnaire",
      'Date de modification 1': '25/04/2019',
      'Colonne concernée 1': 'Candidat',
      'Ancienne valeur 1': 'ancien candidat',
      'Type de modification 2': "Changement d'actionnaire",
      'Date de modification 2': '25/04/2019',
      'Colonne concernée 2': 'Numéro SIREN ou SIRET*',
      'Ancienne valeur 2': 'ancien siret',
    }

    it('should return a modification of type actionnaire with ancien actionnaire and ancien siret', async () => {
      const modifications = parseProjectModifications(phonyLine)

      expect(modifications).toHaveLength(1)
      expect(modifications[0]).toMatchObject({
        type: 'actionnaire',
        actionnairePrecedent: 'ancien candidat',
        siretPrecedent: 'ancien siret',
        modifiedOn: 1556143200000,
      })
    })
  })

  describe('when line has a Producteur modification', () => {
    const phonyLine = {
      'Type de modification 1': 'Changement de producteur',
      'Date de modification 1': '25/04/2019',
      'Colonne concernée 1': 'Nom (personne physique) ou raison sociale (personne morale) : ',
      'Ancienne valeur 1': 'ancien producteur',
    }

    it('should return a modification of type producteur with ancien producteur', async () => {
      const modifications = parseProjectModifications(phonyLine)

      expect(modifications).toHaveLength(1)
      expect(modifications[0]).toMatchObject({
        type: 'producteur',
        producteurPrecedent: 'ancien producteur',
        modifiedOn: 1556143200000,
      })
    })
  })

  describe('when line has a multiple modifications', () => {
    const phonyLine = {
      'Type de modification 1': 'Changement de producteur',
      'Date de modification 1': '25/04/2019',
      'Colonne concernée 1': 'Nom (personne physique) ou raison sociale (personne morale) : ',
      'Ancienne valeur 1': 'ancien producteur',
      'Type de modification 2': 'Prolongation de délai',
      'Date de modification 2': '26/04/2019',
      'Colonne concernée 2': '22/12/2024',
      'Ancienne valeur 2': '01/01/2024',
      'Type de modification 3': 'Recours gracieux',
      'Date de modification 3': '27/04/2019',
      'Colonne concernée 3': 'Classé ?',
      'Ancienne valeur 3': 'Eliminé',
    }

    it('should return all the corresponding modifications', async () => {
      const modifications = parseProjectModifications(phonyLine)

      expect(modifications).toHaveLength(3)
      expect(modifications[0]).toMatchObject({
        type: 'producteur',
        producteurPrecedent: 'ancien producteur',
        modifiedOn: 1556143200000,
      })
      expect(modifications[1]).toMatchObject({
        type: 'delai',
        nouvelleDateLimiteAchevement: 1734822000000,
        ancienneDateLimiteAchevement: 1704063600000,
        modifiedOn: 1556229600000,
      })
      expect(modifications[2]).toMatchObject({
        type: 'recours',
        accepted: false,
        modifiedOn: 1556316000000,
      })
    })
  })

  describe('when line has an illegal modification type', () => {
    const phonyLine = {
      'Type de modification 1': 'This does not exist',
      'Date de modification 1': '25/04/2019',
      'Colonne concernée 1': '',
      'Ancienne valeur 1': '',
    }

    beforeAll(async () => {})

    it('should throw an error', async () => {
      expect.assertions(2)
      try {
        parseProjectModifications(phonyLine)
      } catch (error) {
        expect(error).toBeDefined()
        expect(error.message).toContain("Type de modification 1 n'est pas reconnu")
      }
    })
  })

  describe('when line has an illegal modification date', () => {
    it('should throw an error', async () => {
      expect.assertions(2)
      try {
        parseProjectModifications({
          'Type de modification 1': 'This does not exist',
          'Date de modification 1': 'abcd',
          'Colonne concernée 1': '',
          'Ancienne valeur 1': '',
        })
      } catch (error) {
        expect(error).toBeDefined()
        expect(error.message).toContain("Date de modification 1 n'est pas une date valide")
      }
    })
  })

  describe('when line has a modification date in the future', () => {
    it('should throw an error', async () => {
      expect.assertions(2)
      try {
        parseProjectModifications({
          'Type de modification 1': 'This does not exist',
          'Date de modification 1': moment().add(1, 'day').format('DD/MM/YYYY'),
          'Colonne concernée 1': '',
          'Ancienne valeur 1': '',
        })
      } catch (error) {
        expect(error).toBeDefined()
        expect(error.message).toContain('Date de modification 1 est une date dans le futur')
      }
    })
  })

  describe('when line has a modification date in the distant past (before 01/01/2010)', () => {
    it('should throw an error', async () => {
      expect.assertions(2)
      try {
        parseProjectModifications({
          'Type de modification 1': 'This does not exist',
          'Date de modification 1': '01/01/2009',
          'Colonne concernée 1': '',
          'Ancienne valeur 1': '',
        })
      } catch (error) {
        expect(error).toBeDefined()
        expect(error.message).toContain(
          'Date de modification 1 est une date trop loin dans le passé'
        )
      }
    })
  })
})
