import { beforeAll, describe, expect, it } from '@jest/globals';
import moment from 'moment';
import { parseProjectModifications } from './parseProjectModifications';

describe('parseProjectModifications', () => {
  describe('when line has a single Autre modification', () => {
    const phonyLine = {
      'Type de modification 1': 'Autre',
      'Date de modification 1': '25/04/2019',
      'Colonne concernée 1': 'column',
      'Ancienne valeur 1': 'value',
      'Statut demande 1': 'Acceptée',
      'Nom courrier 1': 'filename',
    };

    it('should return a modification of type autre', async () => {
      const modifications = parseProjectModifications(phonyLine);

      expect(modifications).toHaveLength(1);
      expect(modifications[0]).toMatchObject({
        type: 'autre',
        modifiedOn: 1556143200000,
        column: 'column',
        value: 'value',
        filename: 'filename',
        status: 'acceptée',
      });
    });
  });

  describe('when line has a single Prolongation de délai modification accepted', () => {
    const phonyLine = {
      'Type de modification 1': 'Prolongation de délai',
      'Date de modification 1': '25/04/2019',
      'Colonne concernée 1': '22/12/2024',
      'Ancienne valeur 1': '01/01/2024',
      'Statut demande 1': 'Acceptée',
      'Nom courrier 1': 'filename',
    };

    it('should return an accepted modification of type delai with the proper dates', async () => {
      const modifications = parseProjectModifications(phonyLine);

      expect(modifications).toHaveLength(1);
      expect(modifications[0]).toMatchObject({
        type: 'delai',
        nouvelleDateLimiteAchevement: 1734822000000,
        ancienneDateLimiteAchevement: 1704063600000,
        modifiedOn: 1556143200000,
        status: 'acceptée',
        filename: 'filename',
      });
    });
  });

  describe('when line has a single Prolongation de délai modification accepted without new date', () => {
    it('should throw an error', async () => {
      expect.assertions(2);
      try {
        parseProjectModifications({
          'Type de modification 1': 'Prolongation de délai',
          'Date de modification 1': '25/04/2019',
          'Ancienne valeur 1': '01/01/2024',
          'Statut demande 1': 'Acceptée',
        });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toContain(`Colonne concernée 1 manquante`);
      }
    });
  });

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
      'Statut demande 1': 'Acceptée',
      'Statut demande 2': 'Acceptée',
      'Nom courrier 2': 'filename',
    };

    it('should return a modification of type actionnaire with ancien actionnaire and ancien siret', async () => {
      const modifications = parseProjectModifications(phonyLine);

      expect(modifications).toHaveLength(1);
      expect(modifications[0]).toMatchObject({
        type: 'actionnaire',
        actionnairePrecedent: 'ancien candidat',
        siretPrecedent: 'ancien siret',
        modifiedOn: 1556143200000,
        filename: 'filename',
        status: 'acceptée',
      });
    });
  });

  describe('when line has a Producteur modification', () => {
    const phonyLine = {
      'Type de modification 1': 'Changement de producteur',
      'Date de modification 1': '25/04/2019',
      'Colonne concernée 1': 'Nom (personne physique) ou raison sociale (personne morale) : ',
      'Ancienne valeur 1': 'ancien producteur',
      'Statut demande 1': 'Acceptée',
      'Nom courrier 1': 'filename',
    };

    it('should return a modification of type producteur with ancien producteur', async () => {
      const modifications = parseProjectModifications(phonyLine);

      expect(modifications).toHaveLength(1);
      expect(modifications[0]).toMatchObject({
        type: 'producteur',
        producteurPrecedent: 'ancien producteur',
        modifiedOn: 1556143200000,
        filename: 'filename',
        status: 'acceptée',
      });
    });
  });

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
      'Statut demande 1': 'Acceptée',
      'Statut demande 2': 'Acceptée',
      'Statut demande 3': 'Acceptée',
      'Nom courrier 3': 'filename',
    };

    it('should return all the corresponding modifications', async () => {
      const modifications = parseProjectModifications(phonyLine);

      expect(modifications).toHaveLength(2);
      expect(modifications[0]).toMatchObject({
        type: 'producteur',
        producteurPrecedent: 'ancien producteur',
        modifiedOn: 1556143200000,
        status: 'acceptée',
      });
      expect(modifications[1]).toMatchObject({
        type: 'delai',
        nouvelleDateLimiteAchevement: 1734822000000,
        ancienneDateLimiteAchevement: 1704063600000,
        modifiedOn: 1556229600000,
        status: 'acceptée',
      });
    });
  });

  describe('when line has an illegal modification type', () => {
    const phonyLine = {
      'Type de modification 1': 'This does not exist',
      'Date de modification 1': '25/04/2019',
      'Colonne concernée 1': '',
      'Ancienne valeur 1': '',
      'Statut demande 1': 'Acceptée',
      'Nom courrier 1': 'filename',
    };

    beforeAll(async () => {});

    it('should throw an error', async () => {
      expect.assertions(2);
      try {
        parseProjectModifications(phonyLine);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toContain("Type de modification 1 n'est pas reconnu");
      }
    });
  });

  describe('when line has an illegal modification date', () => {
    it('should throw an error', async () => {
      expect.assertions(2);
      try {
        parseProjectModifications({
          'Type de modification 1': 'This does not exist',
          'Date de modification 1': 'abcd',
          'Colonne concernée 1': '',
          'Ancienne valeur 1': '',
          'Statut demande 1': 'Acceptée',
          'Nom courrier 1': 'filename',
        });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toContain("Date de modification 1 n'est pas une date valide");
      }
    });
  });

  describe('when line has a modification date in the future', () => {
    it('should throw an error', async () => {
      expect.assertions(2);
      try {
        parseProjectModifications({
          'Type de modification 1': 'This does not exist',
          'Date de modification 1': moment().add(1, 'day').format('DD/MM/YYYY'),
          'Colonne concernée 1': '',
          'Ancienne valeur 1': '',
          'Nom courrier 1': 'filename',
        });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toContain('Date de modification 1 est une date dans le futur');
      }
    });
  });

  describe('when line has a modification date in the distant past (before 01/01/2010)', () => {
    it('should throw an error', async () => {
      expect.assertions(2);
      try {
        parseProjectModifications({
          'Type de modification 1': 'This does not exist',
          'Date de modification 1': '01/01/2009',
          'Colonne concernée 1': '',
          'Ancienne valeur 1': '',
          'Statut demande 1': 'Acceptée',
          'Nom courrier 1': 'filename',
        });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toContain(
          'Date de modification 1 est une date trop loin dans le passé',
        );
      }
    });
  });

  describe('when the request status is not "Acceptée", "Refusée" or "Accord de principe"', () => {
    it('should throw an error', async () => {
      expect.assertions(2);
      try {
        parseProjectModifications({
          'Type de modification 1': 'Abandon',
          'Date de modification 1': '25/04/2019',
          'Colonne concernée 1': '',
          'Ancienne valeur 1': '',
          'Statut demande': 'pas ok',
          'Nom courrier 1': 'filename',
        });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toContain(
          `Statut de la modification 1 invalide, le statut doit correspondre à l'une de ces valeurs "Acceptée", "Refusée", ou "Accord de principe"`,
        );
      }
    });
  });
});
