import { beforeAll, describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '../../../../../core/domain';
import { ModificationRequest } from '../..';
import { LegacyModificationImported } from '../../../../../modules/modificationRequest';
import { resetDatabase } from '../../../helpers';
import { onLegacyModificationImported } from './onLegacyModificationImported';

describe('modificationRequest.onLegacyModificationImported', () => {
  const projectId = new UniqueEntityID().toString();
  const importId = new UniqueEntityID().toString();
  const userId = new UniqueEntityID().toString();

  describe('generally', () => {
    const nonLegacyModificationId = new UniqueEntityID().toString();
    const legacyModificationId = new UniqueEntityID().toString();

    beforeAll(async () => {
      await resetDatabase();

      await onLegacyModificationImported(
        new LegacyModificationImported({
          payload: {
            projectId,
            importId,
            modifications: [],
          },
        }),
      );
    });

    it('should remove previous legacy modifications for this project', async () => {
      const previousLegacyModification = await ModificationRequest.findByPk(legacyModificationId);

      expect(previousLegacyModification).toEqual(null);
    });

    it('should not remove the non-legacy modifications', async () => {
      const projectModifications = await ModificationRequest.findAll({ where: { projectId } });

      expect(projectModifications).toHaveLength(0);
    });
  });

  describe('when given a legacy modification of type actionnaire', () => {
    it('should add a modificationRequest of type actionnaire', async () => {
      const modificationId = new UniqueEntityID().toString();

      await resetDatabase();
      await onLegacyModificationImported(
        new LegacyModificationImported({
          payload: {
            projectId,
            importId,
            modifications: [
              {
                type: 'actionnaire',
                actionnairePrecedent: 'actionnairePrecedent',
                siretPrecedent: 'siretPrecedent',
                modifiedOn: 123,
                modificationId,
                filename: 'filename',
                status: 'acceptée',
              },
            ],
          },
        }),
      );

      const newLegacyModification = await ModificationRequest.findByPk(modificationId);
      expect(newLegacyModification).not.toEqual(null);
      expect(newLegacyModification).toMatchObject({
        type: 'actionnaire',
        acceptanceParams: {
          actionnairePrecedent: 'actionnairePrecedent',
          siretPrecedent: 'siretPrecedent',
        },
        status: 'acceptée',
        isLegacy: true,
        filename: 'filename',
      });
    });
  });

  describe('when given a legacy modification of type delai that is accepted', () => {
    it('should add a modificationRequest of type delai accepted', async () => {
      const modificationId = new UniqueEntityID().toString();

      await resetDatabase();
      await onLegacyModificationImported(
        new LegacyModificationImported({
          payload: {
            projectId,
            importId,
            modifications: [
              {
                type: 'delai',
                nouvelleDateLimiteAchevement: 1234,
                ancienneDateLimiteAchevement: 5678,
                modifiedOn: 123,
                modificationId,
                status: 'acceptée',
                filename: 'filename',
              },
            ],
          },
        }),
      );

      const newLegacyModification = await ModificationRequest.findByPk(modificationId);
      expect(newLegacyModification).not.toEqual(null);
      expect(newLegacyModification).toMatchObject({
        type: 'delai',
        acceptanceParams: {
          nouvelleDateLimiteAchevement: 1234,
          ancienneDateLimiteAchevement: 5678,
        },
        status: 'acceptée',
        isLegacy: true,
        filename: 'filename',
      });
    });
  });

  describe('when given a legacy modification of type delai that is not accepted', () => {
    it('should add a modificationRequest of type delai not accepted', async () => {
      const modificationId = new UniqueEntityID().toString();

      await resetDatabase();
      await onLegacyModificationImported(
        new LegacyModificationImported({
          payload: {
            projectId,
            importId,
            modifications: [
              {
                type: 'delai',
                modifiedOn: 123,
                modificationId,
                status: 'rejetée',
                filename: 'filename',
              },
            ],
          },
        }),
      );

      const newLegacyModification = await ModificationRequest.findByPk(modificationId);
      expect(newLegacyModification).not.toEqual(null);
      expect(newLegacyModification).toMatchObject({
        type: 'delai',
        status: 'rejetée',
        isLegacy: true,
        filename: 'filename',
      });
    });
  });

  describe('when given a legacy modification of type producteur', () => {
    it('should add a modificationRequest of type producteur', async () => {
      const modificationId = new UniqueEntityID().toString();

      await resetDatabase();
      await onLegacyModificationImported(
        new LegacyModificationImported({
          payload: {
            projectId,
            importId,
            modifications: [
              {
                type: 'producteur',
                producteurPrecedent: 'producteurPrecedent',
                modifiedOn: 123,
                modificationId,
                filename: 'filename',
                status: 'acceptée',
              },
            ],
          },
        }),
      );

      const newLegacyModification = await ModificationRequest.findByPk(modificationId);
      expect(newLegacyModification).not.toEqual(null);
      expect(newLegacyModification).toMatchObject({
        type: 'producteur',
        acceptanceParams: {
          producteurPrecedent: 'producteurPrecedent',
        },
        status: 'acceptée',
        isLegacy: true,
        filename: 'filename',
      });
    });
  });
});
